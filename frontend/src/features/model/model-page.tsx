import { PageHeader } from "@/components/page-header";
import { ModelInfoCard } from "./model-info-card";

export function ModelPage() {
  return (
    <>
      <PageHeader
        title="모델 성능"
        description="판정 모델/계측 모델의 검증셋 실측 성능"
      />
      <ModelInfoCard />
    </>
  );
}
