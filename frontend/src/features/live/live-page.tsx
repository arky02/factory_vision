import { Video } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import * as styles from "./live-page.css";

export function LivePage() {
  return (
    <>
      <PageHeader
        title="실시간 검사"
        description="웹캠으로 1초 간격 실시간 불량 검출"
      />
      <Card>
        <CardContent className={styles.placeholder}>
          <Video size={32} aria-hidden />
          <p className={styles.text}>Phase 7에서 구현 예정입니다.</p>
          <p className={styles.subText}>
            getUserMedia로 프레임을 캡처해 /detect API로 전송하는 방식
          </p>
        </CardContent>
      </Card>
    </>
  );
}
