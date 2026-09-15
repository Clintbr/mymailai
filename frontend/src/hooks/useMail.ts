import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mailApi } from '../services/mailApi';
import type { EmailMessage } from '../types/mail';

export function useEmails(query?: string) {
  return useQuery({
    queryKey: ['emails', query],
    queryFn: () => mailApi.getEmails(query),
  });
}

export function useEmail(id: string | null) {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => (id ? mailApi.getEmailById(id) : null),
    enabled: !!id,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mailApi.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['email', id] });
    },
  });
}

export function useMarkUnread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mailApi.markAsUnread(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['email', id] });
    },
  });
}

export function useArchiveEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mailApi.archiveEmail(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['email', id] });
    },
  });
}

export function useSendEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: EmailMessage) => mailApi.sendEmail(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });
}

export function useMailProviderInfo() {
  return useQuery({
    queryKey: ['mailProviderInfo'],
    queryFn: () => mailApi.getProviderInfo(),
  });
}
