import { ImageUp } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import * as styles from "./upload-dropzone.css";

interface UploadDropzoneProps {
  onSelect: (file: File) => void;
}

/** 클릭 또는 드래그&드롭으로 이미지를 선택하는 영역 */
export function UploadDropzone({ onSelect }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const acceptFile = (file: File | undefined) => {
    if (file?.type.startsWith("image/")) onSelect(file);
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        acceptFile(e.dataTransfer.files[0]);
      }}
      className={cn(styles.zone, isDragOver && styles.zoneDragOver)}
    >
      <ImageUp size={32} className={styles.icon} aria-hidden />
      <div className={styles.helpText}>
        <span className={styles.helpTextStrong}>클릭해서 선택</span>
        하거나 이미지를 끌어다 놓으세요
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.input}
        onChange={(e) => {
          acceptFile(e.target.files?.[0]);
          e.target.value = ""; // 같은 파일 재선택 허용
        }}
      />
    </button>
  );
}
