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

/** public/samples/ 의 검증된 샘플. expected는 정답 라벨(모델 검출 결과와 일치 확인됨) */
const SAMPLES: Sample[] = [
  { id: "missing-hole",  expected: "missing_hole, missing_hole" },
  { id: "mouse-bite",  expected: "mouse_bite, mouse_bite" },
  { id: "open-circuit",  expected: "open_circuit, open_circuit" },
  { id: "short",  expected: "short, short" },
  { id: "spur",  expected: "spur, spur, spur" },
  { id: "spurious-copper",  expected: "spurious_copper, spurious_copper" },
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
        <CardDescription>
          샘플 이미지로 테스트 해볼 수 있습니다. 하단 텍스트는 해당 샘플에서 검출되어야 하는 불량 라벨입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={styles.grid}>
          {SAMPLES.map((sample, index) => (
            <button
              key={sample.id}
              type="button"
              className={cn(styles.item, sample.wide && styles.itemWide)}
              onClick={() => pick(sample)}
              disabled={disabled}
            >
              <img
                src={`/samples/${sample.id}.jpg`}
                alt={`${sample.id} 샘플 PCB 이미지`}
                loading="lazy"
                className={cn(styles.thumbnail, sample.wide && styles.thumbnailWide)}
              />
              <span className={styles.label}>{`샘플 #${index + 1}`}</span>
              <span className={styles.expected}>{sample.expected}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
