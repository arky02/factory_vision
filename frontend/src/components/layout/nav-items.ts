import { BrainCircuit, History, ScanSearch } from "lucide-react";

export const NAV_ITEMS = [
  { to: "/inspect", label: "검사", icon: ScanSearch },
  { to: "/history", label: "검사 이력", icon: History },
  { to: "/model", label: "모델 성능", icon: BrainCircuit },
] as const;
