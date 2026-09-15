import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AiAnalysisCard } from '../components/ai/AiAnalysisCard';
import type { EmailAnalysis } from '../types/ai';

describe('AiAnalysisCard', () => {
  it('renders call to action when analysis is null', () => {
    const onAnalyze = vi.fn();
    render(<AiAnalysisCard analysis={null} isLoading={false} onAnalyze={onAnalyze} />);

    const button = screen.getByRole('button', { name: /Analyze with Gemini/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onAnalyze).toHaveBeenCalledTimes(1);
  });

  it('renders structured analysis details when analysis is provided', () => {
    const analysis: EmailAnalysis = {
      category: 'JOB',
      priority: 'HIGH',
      summary: 'Tech interview scheduled for Thursday.',
      language: 'English',
      requiresResponse: true,
      suggestedAction: 'REPLY',
      confidence: 0.96,
      keyPoints: ['Available at 2 PM', 'Google Meet'],
    };

    render(<AiAnalysisCard analysis={analysis} isLoading={false} onAnalyze={vi.fn()} />);

    expect(screen.getByText('JOB')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('Draft Reply')).toBeInTheDocument();
    expect(screen.getByText('96%')).toBeInTheDocument();
    expect(screen.getByText('Tech interview scheduled for Thursday.')).toBeInTheDocument();
    expect(screen.getByText('Available at 2 PM')).toBeInTheDocument();
  });
});
