import { useState } from "react";

import { useDetectMutation } from "@/api/queries";
import { PageHeader } from "@/components/page-header";
import { DetectionResultCard } from "./detection-result-card";
import * as styles from "./inspect-page.css";
import { UploadCard } from "./upload-card";

export function InspectPage() {
  const [file, setFile] = useState<File | null>(null);
  const detect = useDetectMutation();

  const handleSelect = (next: File | null) => {
    setFile(next);
    detect.reset(); // 새 이미지를 고르면 이전 결과를 비운다
  };

  return (
    <>
      <PageHeader
        title="불량 검사"
        description="PCB 이미지를 업로드하면 AI가 불량을 검출합니다."
      />
      <div className={styles.grid}>
        <UploadCard
          file={file}
          onSelect={handleSelect}
          onSubmit={() => file && detect.mutate(file)}
          isPending={detect.isPending}
        />
        <DetectionResultCard
          result={detect.data ?? null}
          isPending={detect.isPending}
        />
      </div>
    </>
  );
}
