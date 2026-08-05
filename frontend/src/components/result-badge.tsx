import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as styles from "./result-badge.css";

/** 검사 판정 뱃지 — OK: 정상 / NG: 불량 검출 */
export function ResultBadge({
  result,
  className,
}: {
  result: "OK" | "NG";
  className?: string;
}) {
  return (
    <Badge className={cn(styles.badge[result], className)}>
      {result === "OK" ? "정상" : "불량 검출"}
    </Badge>
  );
}
