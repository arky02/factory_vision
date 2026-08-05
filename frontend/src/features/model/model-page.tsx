import { PageHeader } from "@/components/page-header";
import { ModelInfoCard } from "./model-info-card";

export function ModelPage() {
  return (
    <>
      <PageHeader
        title="모델 성능"
        description="지금 이 사이트의 불량 검사에 사용되고 있는 YOLO11 기반 딥러닝 모델을 검증 데이터셋으로 실측 평가한 결과입니다."
      />
      <ModelInfoCard />
    </>
  );
}
