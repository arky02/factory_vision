import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as styles from "./sample-gallery.css";

interface Sample {
  id: string;
  expected: string;
  wide?: boolean;
}

/**
 * public/samples/ 의 검증된 샘플. expected는 해당 이미지에 담긴 결함 유형이다.
 * 검출 개수는 모델을 교체하면 달라지므로 유형만 적는다.
 */
const SAMPLES: Sample[] = [
  { id: "missing-hole", expected: "missing_hole" },
  { id: "mouse-bite", expected: "mouse_bite" },
  { id: "open-circuit", expected: "open_circuit" },
  { id: "short", expected: "short" },
  { id: "spur", expected: "spur" },
  { id: "spurious-copper", expected: "spurious_copper" },
  { id: "multi-defect", expected: "short + missing_hole", wide: true },
];

interface SampleGalleryProps {
  onPick: (file: File) => void;
  disabled: boolean;
}

export function SampleGallery({ onPick, disabled }: SampleGalleryProps) {
  const pick = async (sample: Sample) => {
    const url = `/samples/${sample.id}.jpg`;
    const blob = await fetch(url).then((res) => res.blob());
    onPick(new File([blob], `${sample.id}.jpg`, { type: "image/jpeg" }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>샘플 테스트</CardTitle>
        <CardDescription>클릭하면 바로 검사합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={styles.grid}>
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className={cn(styles.item, sample.wide && styles.itemWide)}
              onClick={() => pick(sample)}
              disabled={disabled}
            >
              <img
                src={`/samples/${sample.id}.jpg`}
                alt={`${sample.expected} 결함이 있는 PCB 샘플`}
                loading="lazy"
                className={cn(styles.thumbnail, sample.wide && styles.thumbnailWide)}
              />
              <span className={styles.expected}>{sample.expected}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
