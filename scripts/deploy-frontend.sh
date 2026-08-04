#!/usr/bin/env bash
# 프론트엔드 빌드 → S3 업로드 → CloudFront 캐시 무효화
#
# 사용법:
#   S3_BUCKET=my-bucket [CLOUDFRONT_ID=E123ABC] ./scripts/deploy-frontend.sh
#
# 사전 조건: aws configure 완료 (S3/CloudFront 권한 필요)

set -euo pipefail

: "${S3_BUCKET:?S3_BUCKET 환경변수를 지정하세요 (예: S3_BUCKET=factory-vision-web)}"

cd "$(dirname "$0")/../frontend"

echo "==> 빌드"
npm run build

echo "==> S3 업로드: s3://$S3_BUCKET"
aws s3 sync dist "s3://$S3_BUCKET" --delete

if [ -n "${CLOUDFRONT_ID:-}" ]; then
  echo "==> CloudFront 캐시 무효화: $CLOUDFRONT_ID"
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*" >/dev/null
fi

echo "완료"
