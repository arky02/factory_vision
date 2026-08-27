import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getJson, postImage } from "./client";
import type {
  DefectShare,
  DetectionResponse,
  HourlyPoint,
  Inspection,
  StatsSummary,
} from "./types";

export const inspectionsQuery = (limit = 50) =>
  queryOptions({
    queryKey: ["inspections", limit] as const,
    queryFn: () => getJson<Inspection[]>(`/api/inspections?limit=${limit}`),
  });

/** hours를 생략하면 전체 기간을 집계한다 (데모 환경에서는 이쪽이 기본) */
const windowParam = (hours?: number) => (hours === undefined ? "" : `?hours=${hours}`);

export const statsSummaryQuery = (hours?: number) =>
  queryOptions({
    queryKey: ["stats", "summary", hours ?? "all"] as const,
    queryFn: () => getJson<StatsSummary>(`/api/stats/summary${windowParam(hours)}`),
  });

export const statsHourlyQuery = (hours?: number) =>
  queryOptions({
    queryKey: ["stats", "hourly", hours ?? "all"] as const,
    queryFn: () => getJson<HourlyPoint[]>(`/api/stats/hourly${windowParam(hours)}`),
  });

export const defectDistributionQuery = (hours?: number) =>
  queryOptions({
    queryKey: ["stats", "distribution", hours ?? "all"] as const,
    queryFn: () =>
      getJson<DefectShare[]>(`/api/stats/defect-distribution${windowParam(hours)}`),
  });

export const healthQuery = queryOptions({
  queryKey: ["health"] as const,
  queryFn: () => getJson<{ status: string }>("/api/health"),
  refetchInterval: 15_000,
  retry: false,
});

export function useDetectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => postImage<DetectionResponse>("/api/detect", file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) => {
      toast.error("검사 요청에 실패했습니다.", { description: error.message });
    },
  });
}
