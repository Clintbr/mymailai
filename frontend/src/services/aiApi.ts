import { request } from './api';
import type { ApiResponse } from '../types/mail';
import type { AiStatus, EmailAnalysis, ReplySuggestionRequest, ReplySuggestionResponse } from '../types/ai';

export const aiApi = {
  async analyzeEmail(emailId: string): Promise<EmailAnalysis> {
    const res = await request<ApiResponse<EmailAnalysis>>(`/api/ai/analyze/${emailId}`, {
      method: 'POST',
    });
    return res.data;
  },

  async generateReply(emailId: string, requestBody?: ReplySuggestionRequest): Promise<ReplySuggestionResponse> {
    const res = await request<ApiResponse<ReplySuggestionResponse>>(`/api/ai/reply/${emailId}`, {
      method: 'POST',
      body: JSON.stringify(requestBody || {}),
    });
    return res.data;
  },

  async getAiStatus(): Promise<AiStatus> {
    const res = await request<ApiResponse<AiStatus>>('/api/ai/status');
    return res.data;
  },
};
