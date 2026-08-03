import { useSuspenseQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";

import { inspectionsQuery } from "@/api/queries";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { InspectionTable } from "./inspection-table";

export function HistoryPage() {
  const { data: inspections, refetch, isFetching } = useSuspenseQuery(
    inspectionsQuery(50),
  );

  return (
    <>
      <PageHeader
        title="검사 이력"
        description={`최근 검사 ${inspections.length}건`}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RotateCcw className="size-3.5" aria-hidden />
          새로고침
        </Button>
      </PageHeader>
      <InspectionTable inspections={inspections} />
    </>
  );
}
