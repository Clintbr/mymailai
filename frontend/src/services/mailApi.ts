import { request } from './api';
import type { ApiResponse, Email, EmailMessage } from '../types/mail';

export const mailApi = {
  async getEmails(query?: string, limit = 50): Promise<Email[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await request<ApiResponse<Email[]>>(`/api/mail${queryString}`);
    return res.data;
  },

  async getEmailById(id: string): Promise<Email> {
    const res = await request<ApiResponse<Email>>(`/api/mail/${id}`);
    return res.data;
  },

  async markAsRead(id: string): Promise<void> {
    await request<ApiResponse<{ id: string; read: string }>>(`/api/mail/${id}/read`, {
      method: 'POST',
    });
  },

  async markAsUnread(id: string): Promise<void> {
    await request<ApiResponse<{ id: string; read: string }>>(`/api/mail/${id}/unread`, {
      method: 'POST',
    });
  },

  async archiveEmail(id: string): Promise<void> {
    await request<ApiResponse<{ id: string; archived: string }>>(`/api/mail/${id}/archive`, {
      method: 'POST',
    });
  },

  async sendEmail(message: EmailMessage): Promise<void> {
    await request<ApiResponse<{ status: string }>>('/api/mail/send', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },

  async getProviderInfo(): Promise<{ activeProvider: string; available: boolean }> {
    const res = await request<ApiResponse<{ activeProvider: string; available: string }>>('/api/mail/provider');
    return {
      activeProvider: res.data.activeProvider,
      available: res.data.available === 'true',
    };
  },
};
