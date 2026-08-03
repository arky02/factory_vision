import { Skeleton } from "@/components/ui/skeleton";
import * as styles from "./page-skeleton.css";

export function PageSkeleton() {
  return (
    <div className={styles.root} aria-busy>
      <div className={styles.header}>
        <Skeleton className={styles.titleBar} />
        <Skeleton className={styles.descriptionBar} />
      </div>
      <div className={styles.cards}>
        <Skeleton className={styles.card} />
        <Skeleton className={styles.card} />
      </div>
    </div>
  );
}
