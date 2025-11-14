import { render, screen } from '@testing-library/react';
import EntriesList from './EntriesList';

describe('EntriesList', () => {
  it('renders demo entries and helper copy', () => {
    render(<EntriesList />);

    expect(
      screen.getByRole('heading', { level: 2, name: /recent entries/i }),
    ).toBeVisible();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(screen.getByText(/React Query \+ Prisma integration/i)).toBeVisible();
  });
});
