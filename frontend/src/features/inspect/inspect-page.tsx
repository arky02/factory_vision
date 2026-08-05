import { useState } from "react";

import { useDetectMutation } from "@/api/queries";
import { PageHeader } from "@/components/page-header";
import { DetectionResultCard } from "./detection-result-card";
import * as styles from "./inspect-page.css";
import { PipelineCard } from "./pipeline-card";
import { SampleGallery } from "./sample-gallery";
import { UploadCard } from "./upload-card";

export function InspectPage() {
  const [file, setFile] = useState<File | null>(null);
  const detect = useDetectMutation();

  const handleSelect = (next: File | null) => {
    setFile(next);
    detect.reset(); // 새 이미지를 고르면 이전 결과를 비움
  };

  return (
    <>
      <PageHeader
        title="불량 검사"
        description="PCB 이미지를 업로드하여 불량 검사를 실행합니다."
      />
      <div className={styles.page}>
        <div className={styles.grid}>
          <UploadCard
            file={file}
            onSelect={handleSelect}
            onSubmit={() => file && detect.mutate(file)}
            isPending={detect.isPending}
          />
          <div className={styles.rightColumn}>
            <DetectionResultCard
              result={detect.data ?? null}
              isPending={detect.isPending}
            />
            <PipelineCard result={detect.data ?? null} />
          </div>
        </div>
        <SampleGallery onPick={handleSelect} disabled={detect.isPending} />
      </div>
    </>
  );
}
