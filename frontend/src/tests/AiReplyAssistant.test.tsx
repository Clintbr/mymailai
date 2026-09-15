import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AiReplyAssistant } from '../components/ai/AiReplyAssistant';
import type { Email } from '../types/mail';

describe('AiReplyAssistant', () => {
  const mockEmail: Email = {
    id: 'msg-1',
    sender: { name: 'Sarah', email: 'sarah@example.com' },
    recipients: [{ name: 'Alex', email: 'alex@example.com' }],
    subject: 'Interview slot',
    body: 'Are you free on Thursday?',
    timestamp: new Date().toISOString(),
    read: true,
  };

  it('renders tone selection and human-in-the-loop protection badge', () => {
    render(
      <AiReplyAssistant
        email={mockEmail}
        onGenerateReply={vi.fn()}
        onSendReply={vi.fn()}
        isGenerating={false}
        isSending={false}
      />
    );

    expect(screen.getByText('AI Reply Assistant')).toBeInTheDocument();
    expect(screen.getByText(/Human-in-the-loop Protected/i)).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Friendly')).toBeInTheDocument();
    expect(screen.getByText('Concise')).toBeInTheDocument();
  });

  it('calls onGenerateReply when button is clicked', async () => {
    const onGenerateReply = vi.fn().mockResolvedValue({
      suggestedReply: 'Hi Sarah, Thursday at 2 PM works great for me.',
      tone: 'PROFESSIONAL',
      reasoning: 'Clear and direct',
      confidence: 0.95,
    });

    render(
      <AiReplyAssistant
        email={mockEmail}
        onGenerateReply={onGenerateReply}
        onSendReply={vi.fn()}
        isGenerating={false}
        isSending={false}
      />
    );

    const generateBtn = screen.getByRole('button', { name: /Generate Reply Draft/i });
    fireEvent.click(generateBtn);

    expect(onGenerateReply).toHaveBeenCalledWith('PROFESSIONAL', '');

    await waitFor(() => {
      expect(screen.getByText(/Editable Response Draft/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/Hi Sarah, Thursday at 2 PM works great for me./i)).toBeInTheDocument();
    });
  });
});
