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

export const statsSummaryQuery = (hours = 24) =>
  queryOptions({
    queryKey: ["stats", "summary", hours] as const,
    queryFn: () => getJson<StatsSummary>(`/api/stats/summary?hours=${hours}`),
  });

export const statsHourlyQuery = (hours = 24) =>
  queryOptions({
    queryKey: ["stats", "hourly", hours] as const,
    queryFn: () => getJson<HourlyPoint[]>(`/api/stats/hourly?hours=${hours}`),
  });

export const defectDistributionQuery = (hours = 24) =>
  queryOptions({
    queryKey: ["stats", "distribution", hours] as const,
    queryFn: () =>
      getJson<DefectShare[]>(`/api/stats/defect-distribution?hours=${hours}`),
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
