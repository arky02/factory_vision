import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getJson, postImage } from "./client";
import type { DetectionResponse, Inspection } from "./types";

export const inspectionsQuery = (limit = 50) =>
  queryOptions({
    queryKey: ["inspections", limit] as const,
    queryFn: () => getJson<Inspection[]>(`/api/inspections?limit=${limit}`),
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
    },
    onError: (error) => {
      toast.error("검사 요청에 실패했습니다.", { description: error.message });
    },
  });
}
