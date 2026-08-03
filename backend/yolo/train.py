"""YOLO Fine-tuning 스크립트 (Colab GPU 권장).

사용 예:
    python train.py --data dataset/data.yaml --epochs 50 --imgsz 640
"""

import argparse

from ultralytics import YOLO


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="dataset/data.yaml", help="data.yaml 경로")
    parser.add_argument("--model", default="yolo11n.pt", help="사전학습 모델")
    parser.add_argument("--epochs", type=int, default=50)
    parser.add_argument("--imgsz", type=int, default=640)
    parser.add_argument("--batch", type=int, default=16)
    args = parser.parse_args()

    model = YOLO(args.model)
    model.train(
        data=args.data,
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        project="runs",
        name="pcb",
    )
    # 학습 완료 후 runs/pcb/weights/best.pt 생성
    # → backend/yolo/weights/best.pt 로 복사하여 사용

    metrics = model.val()
    print(f"mAP50: {metrics.box.map50:.4f}")
    print(f"mAP50-95: {metrics.box.map:.4f}")


if __name__ == "__main__":
    main()
