import { PageHeader } from "@/components/page-header";
import { ModelInfoCard } from "./model-info-card";

export function ModelPage() {
  return (
    <>
      <PageHeader
        title="모델 성능"
        description="현재 서비스에 적용된 YOLO11 기반 딥러닝 모델의 성능 지표입니다. 검증 데이터셋 2,616장을 실측 평가하여 산출했습니다."
      />
      <ModelInfoCard />
    </>
  );
}
