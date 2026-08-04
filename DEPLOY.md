# 배포 가이드 — S3 (프론트) + EC2 (백엔드) + CloudFront

```
사용자 ── HTTPS ──▶ CloudFront ──┬─ 기본 경로        ──▶ S3 (정적 프론트)
                                 └─ /api/*, /static/* ──▶ EC2 (FastAPI + PostgreSQL, Docker)
```

같은 도메인에서 경로로 라우팅하므로 CORS·mixed content 문제가 없고, 프론트 코드는 dev/prod 동일하게 동작한다.

---

## 1. EC2 — 백엔드

### 인스턴스 생성 (AWS 콘솔 → EC2 → 인스턴스 시작)

- 리전: `ap-northeast-2` (서울)
- AMI: Ubuntu Server 24.04 LTS
- 타입: **t3.small 이상 권장** (t3.micro는 1GB라 PyTorch 로드 시 OOM 위험 — 쓰려면 아래 스왑 설정 필수)
- 키 페어: 새로 만들고 `.pem` 다운로드
- 보안 그룹 인바운드: `80` (HTTP, 0.0.0.0/0), `22` (SSH, 내 IP)
- 스토리지: 20GB 이상 (Docker 이미지가 수 GB)

### 서버 세팅

```bash
ssh -i key.pem ubuntu@<EC2_PUBLIC_IP>

# (t3.micro인 경우만) 스왑 2GB
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Docker 설치
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu && exit   # 재접속하면 docker 권한 적용
```

### 코드 + 모델 배포

```bash
# 로컬에서: 모델 가중치 전송 (git에 없음)
scp -i key.pem backend/yolo/weights/best.pt ubuntu@<EC2_IP>:~/

# EC2에서:
git clone <레포 주소> factory_vision && cd factory_vision
mkdir -p backend/yolo/weights && mv ~/best.pt backend/yolo/weights/
DB_PASSWORD='강력한비밀번호' docker compose up -d --build

# 확인
curl http://localhost/api/health   # {"status":"ok"}
```

브라우저에서 `http://<EC2_PUBLIC_IP>/api/health` 확인.

> EC2를 중지/시작하면 퍼블릭 IP가 바뀐다. 데모 기간에는 탄력적 IP(Elastic IP)를 할당해 고정할 것 (인스턴스에 연결된 상태면 무료).

---

## 2. S3 — 프론트

콘솔 → S3 → 버킷 만들기:

- 이름: `factory-vision-web` (전역 유일해야 하므로 적당히 변형)
- 리전: `ap-northeast-2`
- **퍼블릭 액세스 차단 유지** (CloudFront OAC로만 접근시킴 — 버킷을 공개할 필요 없음)

업로드는 스크립트로:

```bash
# 사전: aws configure (액세스 키 등록)
S3_BUCKET=factory-vision-web ./scripts/deploy-frontend.sh
```

---

## 3. CloudFront

콘솔 → CloudFront → 배포 생성:

**Origin 2개**

| Origin | 설정 |
| --- | --- |
| S3 버킷 | Origin access: **Origin access control(OAC)** 생성·연결 → 안내에 따라 버킷 정책 복사·적용 |
| EC2 | Origin domain: `<EC2 퍼블릭 DNS>`, 프로토콜: **HTTP only**, 포트 80 |

**Behaviors** (우선순위 순)

| 경로 패턴 | Origin | 설정 |
| --- | --- | --- |
| `/api/*` | EC2 | 캐시 정책: **CachingDisabled**, Origin request 정책: **AllViewerExceptHostHeader**, 허용 메서드: GET,HEAD,OPTIONS,PUT,POST,PATCH,DELETE |
| `/static/*` | EC2 | 캐시 정책: CachingOptimized (검출 이미지는 불변이라 캐시 OK) |
| 기본 (`*`) | S3 | 캐시 정책: CachingOptimized, 뷰어 프로토콜: Redirect HTTP to HTTPS |

**SPA 라우팅 대응** — 배포 생성 후 → 오류 페이지 탭:

- 403 → 응답 페이지 `/index.html`, HTTP 코드 200
- 404 → 응답 페이지 `/index.html`, HTTP 코드 200

(react-router 경로를 새로고침해도 index.html이 응답되도록)

배포 완료 후 `https://<배포ID>.cloudfront.net` 접속 → 검사 탭에서 샘플 클릭 테스트.

---

## 4. 이후 업데이트 루틴

| 대상 | 방법 |
| --- | --- |
| 프론트 수정 | `S3_BUCKET=... CLOUDFRONT_ID=... ./scripts/deploy-frontend.sh` |
| 백엔드 수정 | EC2에서 `git pull && docker compose up -d --build` |
| 모델 교체 | 새 `best.pt` scp → `docker compose restart backend` |

## 5. 커스텀 도메인 (선택, 나중에)

도메인 구매 후: ACM(버지니아 리전)에서 무료 인증서 발급 → CloudFront 배포에 대체 도메인(CNAME) + 인증서 연결 → DNS에 CNAME 레코드 추가. 코드·인프라 변경 없음.

## 비용 (서울 리전, 대략)

- EC2 t3.small: ~$19/월 (데모 안 할 때 중지하면 시간분만 과금)
- 탄력적 IP: 인스턴스 연결 중 무료, 미연결 시 ~$3.6/월
- S3 + CloudFront: 이 트래픽 규모에선 $1 미만
