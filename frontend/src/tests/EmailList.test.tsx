import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailList } from '../components/mail/EmailList';
import type { Email } from '../types/mail';

describe('EmailList', () => {
  const mockEmails: Email[] = [
    {
      id: 'msg-01',
      sender: { name: 'Elena Rostova', email: 'elena@cloudscale.org' },
      recipients: [{ email: 'alex@example.com' }],
      subject: 'Architecture Review Roadmap',
      snippet: 'Hey Alex, I have drafted the preliminary architectural blueprint...',
      body: 'Full body content',
      timestamp: new Date().toISOString(),
      read: false,
      labels: ['WORK'],
    },
  ];

  it('renders list of emails with subject, snippet, and sender', () => {
    const onSelect = vi.fn();
    render(
      <EmailList
        emails={mockEmails}
        selectedEmailId={null}
        onSelectEmail={onSelect}
        isLoading={false}
      />
    );

    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();
    expect(screen.getByText('Architecture Review Roadmap')).toBeInTheDocument();
    expect(screen.getByText(/preliminary architectural blueprint/i)).toBeInTheDocument();
    expect(screen.getByText('WORK')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Architecture Review Roadmap'));
    expect(onSelect).toHaveBeenCalledWith('msg-01');
  });

  it('shows empty message when no emails are present', () => {
    render(
      <EmailList
        emails={[]}
        selectedEmailId={null}
        onSelectEmail={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText(/No emails found/i)).toBeInTheDocument();
  });
});
