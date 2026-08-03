import { AlertCircle, RotateCcw } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import * as styles from "./error-fallback.css";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className={styles.root}>
      <Alert variant="destructive">
        <AlertCircle size={16} aria-hidden />
        <AlertTitle>데이터를 불러오지 못했습니다</AlertTitle>
        <AlertDescription className={styles.body}>
          <p>{error instanceof Error ? error.message : "알 수 없는 오류"}</p>
          <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
            <RotateCcw size={14} aria-hidden />
            다시 시도
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
