import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as styles from "./result-badge.css";

/** PASS(OK) / FAIL(NG) 판정 뱃지 */
export function ResultBadge({
  result,
  className,
}: {
  result: "OK" | "NG";
  className?: string;
}) {
  return (
    <Badge className={cn(styles.badge[result], className)}>
      {result === "OK" ? "PASS" : "FAIL"}
    </Badge>
  );
}
