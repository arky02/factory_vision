import { useQuery } from "@tanstack/react-query";

import { healthQuery } from "@/api/queries";
import * as styles from "./server-status.css";

const STATUS = {
  ok: "추론 서버 정상",
  error: "추론 서버 연결 안 됨",
  pending: "확인 중…",
} as const;

/** 추론 서버 헬스체크 표시. Suspense를 태우지 않도록 useQuery를 사용한다. */
export function ServerStatus() {
  const { isSuccess, isError } = useQuery(healthQuery);
  const state = isSuccess ? "ok" : isError ? "error" : "pending";

  return (
    <div className={styles.root}>
      <span className={styles.dot[state]} aria-hidden />
      {STATUS[state]}
    </div>
  );
}
