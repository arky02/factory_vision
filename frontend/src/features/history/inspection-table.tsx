import { Inbox } from "lucide-react";

import type { Inspection } from "@/api/types";
import { ResultBadge } from "@/components/result-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import * as styles from "./inspection-table.css";

export function InspectionTable({ inspections }: { inspections: Inspection[] }) {
  if (inspections.length === 0) {
    return (
      <Card>
        <CardContent className={styles.empty}>
          <Inbox size={32} aria-hidden />
          <p className={styles.emptyText}>아직 검사 이력이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.tableCard}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={styles.colImage}>결과 이미지</TableHead>
            <TableHead className={styles.colTime}>검사 시각</TableHead>
            <TableHead className={styles.colResult}>판정</TableHead>
            <TableHead>검출된 불량</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inspections.map((inspection) => (
            <InspectionRow key={inspection.id} inspection={inspection} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function InspectionRow({ inspection }: { inspection: Inspection }) {
  return (
    <TableRow>
      <TableCell>
        <a
          href={inspection.detected_image_path}
          target="_blank"
          rel="noreferrer"
          aria-label="결과 이미지 원본 보기"
        >
          <img
            src={inspection.detected_image_path}
            alt=""
            loading="lazy"
            className={styles.thumbnail}
          />
        </a>
      </TableCell>
      <TableCell className={styles.timeCell}>
        {formatDateTime(inspection.inspection_time)}
      </TableCell>
      <TableCell>
        <ResultBadge result={inspection.inspection_result} />
      </TableCell>
      <TableCell>
        <DefectSummary inspection={inspection} />
      </TableCell>
    </TableRow>
  );
}

function DefectSummary({ inspection }: { inspection: Inspection }) {
  if (inspection.defects.length === 0) {
    return <span className={styles.noDefect}>—</span>;
  }
  return (
    <div className={styles.defectBadges}>
      {inspection.defects.map((defect, i) => (
        <Badge key={i} variant="secondary">
          {defect.defect_type}
        </Badge>
      ))}
    </div>
  );
}
