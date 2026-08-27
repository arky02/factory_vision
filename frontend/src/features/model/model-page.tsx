import { PageHeader } from "@/components/page-header";
import { ModelInfoCard } from "./model-info-card";

export function ModelPage() {
  return (
    <>
      <PageHeader
        title="모델 성능"
        description="판정은 검출 모델이, 면적 계측은 세그멘테이션 모델이 담당합니다. 두 모델의 성능을 검증 데이터셋 1,592장으로 실측 평가한 결과입니다."
      />
      <ModelInfoCard />
    </>
  );
}
