# FactoryVision — AI 비전 불량 검사 플랫폼

> OpenCV + YOLO 기반 PCB 불량 검사를 실제 서비스 형태로 운영하는 End-to-End AI Vision Inspection Platform

---

## 1. 프로젝트 개요

**FactoryVision**은 제조 현장의 육안 검사를 AI로 대체하는 **산업용 불량 검사 시스템**이다. 사용자가 웹에서 PCB 이미지를 업로드하거나 웹캠으로 촬영하면, 서버가 OpenCV 전처리와 YOLO 추론을 거쳐 불량의 위치·종류·확신도를 판정하고, 결과를 데이터베이스에 축적하여 대시보드에서 실시간 통계와 AI 분석 리포트를 제공한다.

이 프로젝트의 핵심은 단순 객체 탐지 모델 학습이 아니라, **AI 모델을 실제 서비스로 운영하는 전체 파이프라인의 구축**이다. 모델 학습부터 추론 서버, 데이터 저장, 실시간 모니터링, 자동 리포트까지 실제 제조업 비전 검사 시스템과 유사한 구조를 지향한다.

---

## 2. 검사 프로세스

```
이미지 입력 (업로드 / 웹캠)
        │
        ▼
OpenCV 전처리 ──── CLAHE, Denoising 등으로 조명 변화·노이즈 보정
        │
        ▼
YOLO 추론 ──────── Fine-tuning된 모델(best.pt)로 불량 위치·종류·confidence 검출
        │
        ▼
결과 생성 ──────── Bounding Box 이미지 저장, PASS/FAIL 판정
        │
        ▼
DB 저장 ────────── 검사 이력·불량 내역 축적 (PostgreSQL)
        │
        ▼
대시보드 ────────── 실시간 통계, AI 분석 리포트, 불량률 Alert
```

---

## 3. 시스템 아키텍처

```
[사용자 브라우저]
  React Dashboard (이미지 업로드 / 웹캠 캡처 / 통계 조회)
        │  REST API
        ▼
[FastAPI 추론 서버 - Python]
  1) OpenCV 전처리
  2) YOLO 추론 (best.pt, 서버 시작 시 1회 로드)
  3) Bounding Box 이미지 생성·저장
  4) 검사 결과 DB 저장
  5) 통계 집계 API / AI 리포트 생성 (LLM API)
        │
        ▼
[PostgreSQL]  검사 이력·불량 내역 축적
```

### 아키텍처 결정 사항

- **백엔드는 FastAPI(Python) 단일 서버로 통일.** YOLO·OpenCV·PyTorch가 모두 Python 생태계이므로 추론 서버는 Python이 필수이며, DB 저장·통계·리포트도 추론 결과와 결합되어 있어 단일 서버로 관리한다. Python + FastAPI는 실무 AI 서빙의 표준 스택이다.
- **학습과 서빙의 분리.** 학습(GPU 필요)은 Google Colab에서 수행하고, 산출물인 `best.pt`만 서버에 배포한다. 운영 서버는 CPU 추론만 수행하므로 GPU가 필요 없다.
- **모델은 FastAPI lifespan에서 1회만 로드**하여 메모리에 상주시킨다. 요청마다 로드하지 않는다.
- **웹캠은 브라우저 `getUserMedia`로 캡처**하여 1초 간격으로 `/detect` API에 전송한다. 서버 측 카메라 접근은 Docker·원격 환경에서 동작하지 않기 때문이다.

---

## 4. 기술 스택

| 영역 | 기술 | 용도 |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite | SPA 대시보드 |
| | TanStack Query, React Router | API 상태 관리, 라우팅 |
| | shadcn/ui, Recharts | UI 컴포넌트, 통계 차트 |
| Backend | Python, FastAPI | AI 추론 + REST API 서버 |
| | SQLAlchemy, Pydantic, Alembic | ORM, 스키마 검증, DB 마이그레이션 |
| AI | Ultralytics YOLO11, PyTorch | 불량 검출 모델 (Transfer Learning) |
| | OpenCV | 이미지 전처리 |
| | LLM API (OpenAI 등) | 불량 분석 리포트 자동 생성 |
| Database | PostgreSQL | 검사 이력 저장 |
| Infra | Docker, Docker Compose | `docker compose up` 한 번으로 전체 실행 |

---

## 5. 데이터셋

PCB(인쇄회로기판) 불량 검출용 공개 데이터셋 **HRIPCB (PKU-Market-PCB)** 계열을 사용한다. Roboflow에 YOLO 포맷으로 변환된 버전이 공개되어 있어 포맷 변환 없이 바로 학습에 사용할 수 있다.

6개 불량 클래스:

| 클래스 | 설명 |
| --- | --- |
| Missing Hole | 있어야 할 구멍이 누락됨 |
| Mouse Bite | 기판 가장자리가 갉아먹힌 듯 파임 |
| Open Circuit | 회로가 끊어짐 (단선) |
| Short | 회로가 붙어버림 (단락) |
| Spur | 불필요한 돌기 |
| Spurious Copper | 불필요한 구리 잔여물 |

---

## 6. AI 파이프라인

### 6-1. 모델 학습 (Google Colab GPU)

사전학습된 `yolo11n.pt` 또는 `yolo11s.pt`를 PCB 데이터셋으로 Fine-tuning(Transfer Learning)한다. 모델을 처음부터 구현하지 않는다.

```python
from ultralytics import YOLO
model = YOLO("yolo11n.pt")
model.train(data="data.yaml", epochs=50, imgsz=640)
# → runs/detect/train/weights/best.pt 생성
```

- PCB 불량은 작은 객체이므로 입력 이미지 크기(`imgsz`)가 정확도에 큰 영향을 준다.
- 목표 성능: mAP50 ≥ 0.9
- 학습 스크립트(`train.py`)는 레포에 포함하여 재현 가능하게 관리한다.

### 6-2. OpenCV 전처리

YOLO 입력 전 화질 개선 목적의 전처리를 수행한다. 조명 변화와 노이즈를 줄여 검출 정확도를 높인다.

- CLAHE (적응형 히스토그램 평활화) — 조명 불균형 보정
- Denoising — 노이즈 제거
- Brightness Normalization, ROI Crop 등

전처리 단계는 **함수를 조합하는 파이프라인 패턴**으로 모듈화하여, 설정 변경만으로 단계를 추가·제거할 수 있게 구현한다. (Resize·정규화는 Ultralytics가 내부 처리하므로 전처리는 화질 개선에 집중)

### 6-3. 추론 API

**`POST /detect`** — 이미지 업로드 시 전처리 → YOLO 추론 → Bounding Box 이미지 저장 → DB 저장을 수행하고 JSON을 반환한다.

```json
{
  "result": "NG",
  "confidence": 0.98,
  "detected_image_url": "/static/detections/xxx.jpg",
  "defects": [
    { "type": "Short", "confidence": 0.98, "bbox": [120, 45, 210, 98] }
  ]
}
```

---

## 7. 데이터베이스 설계

한 번의 검사에서 여러 불량이 검출될 수 있으므로 **1:N 구조**로 설계한다.

**inspections (검사 이력)**

| 컬럼 | 설명 |
| --- | --- |
| id | PK |
| image_path | 원본 이미지 경로 |
| detected_image_path | Bounding Box가 그려진 결과 이미지 경로 |
| inspection_result | PASS / FAIL |
| inspection_time | 검사 시각 |

**defects (검출된 불량, inspection당 N개)**

| 컬럼 | 설명 |
| --- | --- |
| id | PK |
| inspection_id | FK → inspections |
| defect_type | 불량 클래스 |
| confidence | 확신도 |
| bbox | 좌표 |

- Alembic 마이그레이션을 도입하여 향후 LOT 번호, 생산 라인 번호 등의 컬럼 확장에 대비한다.

---

## 8. 주요 기능

### 검사 화면

- 이미지 업로드 → 즉시 Detection 수행
- Bounding Box가 그려진 결과 이미지 표시
- 검출된 불량 목록 + 각 Confidence 표시
- 최종 판정 **PASS / FAIL** 뱃지

### 대시보드 (제조 현장 모니터링 화면)

- 오늘 검사 건수 / 정상 수 / 불량 수 / 불량률
- 최다 발생 Defect
- 시간별 검사 건수·불량률 추이 차트
- Defect 비율 Pie Chart
- 최근 검사 목록
- 통계는 백엔드 집계 API(`GET /stats/…`)에서 SQL로 계산하고, 프론트는 TanStack Query 폴링으로 준실시간 갱신

### AI 리포트

- 집계된 통계(JSON)를 LLM API에 전달하여 요약·원인 추정·권고사항을 자동 생성
- 예시: "오늘 총 1,024개의 PCB를 검사했으며 불량률은 3.8%입니다. Short가 전체 불량의 46%로 평균보다 높아 납땜 공정 점검을 권장합니다."
- 수치 계산은 SQL이 담당하고 LLM은 해석·권고만 담당하여 신뢰도를 확보

### Alert

- 불량률이 기준치(예: 5%) 초과 시 대시보드에 Warning 표시
- 알림 발송부를 인터페이스로 분리하여 향후 Slack / Discord Webhook 연동 가능하게 설계

### 실시간 웹캠 검사

- 브라우저 `getUserMedia`로 웹캠 영상 취득 → 1초 간격으로 프레임 캡처 → `/detect` API 전송 → 결과를 화면에 오버레이
- 기존 추론 API를 그대로 재사용하므로 추가 백엔드 작업 최소화

---

## 9. 프로젝트 구조

```
factory-vision/
├── frontend/                  # React + Vite
├── backend/
│   ├── main.py                # FastAPI 앱 (lifespan에서 모델 1회 로드)
│   ├── routers/               # detect, stats, report
│   ├── services/              # inference.py, preprocess.py
│   ├── models/                # SQLAlchemy 모델
│   ├── schemas/               # Pydantic 스키마
│   ├── database/              # 엔진, 세션
│   └── yolo/
│       ├── train.py           # 학습 스크립트 (Colab 재현용)
│       ├── dataset/
│       └── weights/best.pt    # 학습된 모델 (git 제외, 별도 배포)
├── docker-compose.yml         # db + backend + frontend
└── README.md
```

---

## 10. 개발 로드맵

원칙: **AI 파이프라인부터 검증하고 그 위에 서비스를 쌓는다.**

| Phase | 내용 | 완료 기준 |
| --- | --- | --- |
| 1 | 데이터셋 확보 + Colab 학습 | `best.pt` 생성, mAP50 ≥ 0.9 |
| 2 | 전처리 모듈 + FastAPI 추론 서버 | Swagger UI에서 `/detect` 동작 확인 |
| 3 | PostgreSQL 연동, 검사 이력 저장 | 검사 결과가 DB에 축적됨 |
| 4 | React 검사 화면 (업로드/결과) | 업로드 → 결과 이미지 + PASS/FAIL 표시 |
| 5 | 대시보드 통계 + 차트 | 집계 API + Recharts 시각화 |
| 6 | AI 리포트 + Alert | LLM 리포트 생성, 불량률 경고 |
| 7 | 웹캠 실시간 검사 | 1초 간격 실시간 검출 |
| 8 | Docker Compose 통합 | `docker compose up` 한 번으로 전체 실행 |

---

## 11. 확장 계획

- LOT 번호·생산 라인 번호 기반 이력 관리
- Slack / Discord Webhook 알림 연동
- WebSocket 기반 실시간 대시보드 갱신
- 반도체 웨이퍼 검사 등 타 도메인 데이터셋으로 확장 (모델 교체만으로 대응 가능한 구조)
