import { PageHeader } from "@/components/page-header";
import { ModelInfoCard } from "./model-info-card";

export function ModelPage() {
  return (
    <>
      <PageHeader
        title="모델 성능"
        description="현재 서비스에 적용된 YOLO11 세그멘테이션 모델의 성능 지표입니다. 결함의 위치뿐 아니라 영역을 픽셀 단위로 분할해 면적까지 계측합니다. 검증 데이터셋 1,592장을 실측 평가하여 산출했습니다."
      />
      <ModelInfoCard />
    </>
  );
}
