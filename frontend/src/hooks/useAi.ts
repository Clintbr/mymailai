import { useMutation, useQuery } from '@tanstack/react-query';
import { aiApi } from '../services/aiApi';
import type { ReplySuggestionRequest } from '../types/ai';

export function useAnalyzeEmail() {
  return useMutation({
    mutationFn: (emailId: string) => aiApi.analyzeEmail(emailId),
  });
}

export function useGenerateReply() {
  return useMutation({
    mutationFn: ({ emailId, request }: { emailId: string; request?: ReplySuggestionRequest }) =>
      aiApi.generateReply(emailId, request),
  });
}

export function useAiStatus() {
  return useQuery({
    queryKey: ['aiStatus'],
    queryFn: () => aiApi.getAiStatus(),
  });
}
