import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import { EntriesList } from './features/entries';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <EntriesList />,
      },
      {
        path: 'entries/new',
        element: (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
            Entry form scaffold coming soon.
          </div>
        ),
      },
    ],
  },
]);
