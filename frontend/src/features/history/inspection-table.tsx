import { Inbox } from "lucide-react";
import { useState } from "react";

import type { Inspection } from "@/api/types";
import { ResultBadge } from "@/components/result-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatPercent } from "@/lib/format";
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
      <div className={styles.scrollArea}>
        <Table className={styles.tableMin}>
          <TableHeader>
            <TableRow>
              <TableHead className={styles.colImage}>결과 이미지</TableHead>
              <TableHead className={styles.colTime}>검사 시각</TableHead>
              <TableHead className={styles.colResult}>판정</TableHead>
              <TableHead>검출된 결함</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspections.map((inspection) => (
              <InspectionRow key={inspection.id} inspection={inspection} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function InspectionRow({ inspection }: { inspection: Inspection }) {
  return (
    <TableRow>
      <TableCell>
        <ImagePreview inspection={inspection} />
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

/** 썸네일 클릭 → 결과 이미지 확대 미리보기 (X 버튼/ESC/바깥 클릭으로 닫힘) */
function ImagePreview({ inspection }: { inspection: Inspection }) {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const switchId = `annotations-${inspection.id}`;

  return (
    <Dialog onOpenChange={() => setShowAnnotations(true)}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={styles.thumbnailButton}
          aria-label="결과 이미지 크게 보기"
        >
          <img
            src={inspection.detected_image_path}
            alt=""
            loading="lazy"
            className={styles.thumbnail}
          />
        </button>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: "min(56rem, 92vw)" }}>
        <DialogHeader>
          <DialogTitle>검사 결과 이미지</DialogTitle>
          <DialogDescription>
            {formatDateTime(inspection.inspection_time)} · 검출된 결함{" "}
            {inspection.defects.length}건
          </DialogDescription>
        </DialogHeader>
        <div className={styles.previewControls}>
          <Switch
            id={switchId}
            checked={showAnnotations}
            onCheckedChange={setShowAnnotations}
          />
          <Label htmlFor={switchId}>결함 표시 (annotation)</Label>
        </div>
        <img
          src={
            showAnnotations
              ? inspection.detected_image_path
              : inspection.image_path
          }
          alt={
            showAnnotations
              ? "결함 위치가 표시된 검사 결과 이미지 (확대)"
              : "원본 검사 이미지 (확대)"
          }
          className={styles.previewImage}
        />
      </DialogContent>
    </Dialog>
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
          <span className={styles.badgeConfidence}>
            {formatPercent(defect.confidence)}
          </span>
        </Badge>
      ))}
    </div>
  );
}
