import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../components/layout/Footer';

describe('Footer', () => {
  it('renders API metadata, team, license, and OpenAPI docs link', () => {
    render(<Footer />);

    expect(screen.getByText('AI Mail Manager API')).toBeInTheDocument();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('AI Mail Manager Team')).toBeInTheDocument();
    expect(screen.getByText('Apache 2.0')).toBeInTheDocument();
    expect(screen.getByText('OpenAPI Docs')).toBeInTheDocument();

    const githubLink = screen.getByTitle('AI Mail Manager Founder on GitHub');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Clintbr');

    const licenseLink = screen.getByTitle('View Apache 2.0 License');
    expect(licenseLink).toHaveAttribute('href', 'https://www.apache.org/licenses/LICENSE-2.0');

    const docsLink = screen.getByTitle('Open Swagger UI API Documentation');
    expect(docsLink).toHaveAttribute('href', 'http://localhost:8080/swagger-ui.html');
  });
});
