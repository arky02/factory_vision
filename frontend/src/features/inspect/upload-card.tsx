import { Loader2, RotateCcw, ScanSearch, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useObjectUrl } from "@/lib/use-object-url";
import * as styles from "./upload-card.css";
import { UploadDropzone } from "./upload-dropzone";

interface UploadCardProps {
  file: File | null;
  onSelect: (file: File | null) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function UploadCard({ file, onSelect, onSubmit, isPending }: UploadCardProps) {
  const previewUrl = useObjectUrl(file);

  return (
    <Card>
      <CardHeader>
        <CardTitle>이미지 업로드</CardTitle>
      </CardHeader>
      <CardContent>
        {previewUrl ? (
          <div className={styles.preview}>
            <div className={styles.previewFrame}>
              <img
                src={previewUrl}
                alt="업로드한 검사 대상 이미지 미리보기"
                className={styles.previewImage}
              />
              <Button
                variant="secondary"
                size="icon"
                className={styles.removeButton}
                onClick={() => onSelect(null)}
                disabled={isPending}
                aria-label="선택한 이미지 제거"
              >
                <X size={16} />
              </Button>
            </div>
            <p className={styles.fileName}>{file?.name}</p>
          </div>
        ) : (
          <UploadDropzone onSelect={onSelect} />
        )}
      </CardContent>
      <CardFooter className={styles.footer}>
        <Button
          className={styles.submitButton}
          size="lg"
          onClick={onSubmit}
          disabled={!file || isPending}
        >
          {isPending ? (
            <>
              <Loader2 size={16} className={styles.spinner} aria-hidden />
              검사 중…
            </>
          ) : (
            <>
              <ScanSearch size={16} aria-hidden />
              검사 시작
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className={styles.submitButton}
          onClick={() => onSelect(null)}
          disabled={!file || isPending}
        >
          <RotateCcw size={14} aria-hidden />
          이미지 초기화
        </Button>
      </CardFooter>
    </Card>
  );
}
