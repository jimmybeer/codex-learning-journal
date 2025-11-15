import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import EntriesPage from './EntriesPage';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('EntriesPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders entries returned from the API', async () => {
    const entries = [
      {
        id: 'entry-1',
        title: 'Sketch the UI',
        summary: 'Outlined the basic layout for the journal.',
        status: 'IN_PROGRESS',
        content: 'Building the initial prototype.',
        createdAt: '2024-04-15T12:00:00.000Z',
        updatedAt: '2024-04-15T12:00:00.000Z',
      },
    ];

    const formattedDate = new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
    }).format(new Date(entries[0].createdAt));

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => entries,
    } as unknown as Response);

    render(
      <QueryClientProvider client={createQueryClient()}>
        <EntriesPage />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Sketch the UI')).toBeInTheDocument();
    expect(
      screen.getByRole('cell', {
        name: entries[0].status.replace(/_/g, ' '),
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', {
        name: formattedDate,
      }),
    ).toBeInTheDocument();
  });

  it('displays an error message if the list request fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Unable to fetch entries' }),
    } as unknown as Response);

    render(
      <QueryClientProvider client={createQueryClient()}>
        <EntriesPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Unable to fetch entries')).toBeInTheDocument();
    });
  });
});
