type Entry = {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
};

const demoEntries: Entry[] = [
  {
    id: '1',
    title: 'Set up project scaffolding',
    summary: 'Captured baseline tooling and verified prerequisites.',
    createdAt: '2024-01-01T08:00:00.000Z',
  },
  {
    id: '2',
    title: 'Document learning progress',
    summary: 'Outlined a lightweight workflow for the journal entries feature.',
    createdAt: '2024-01-03T14:30:00.000Z',
  },
];

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
    new Date(isoDate),
  );

const EntriesList = () => {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500">
          Learning journal
        </p>
        <h2 className="text-2xl font-semibold">Recent entries</h2>
        <p className="text-sm text-slate-500">
          React Query + Prisma integration will populate this list soon.
        </p>
      </div>

      <ol className="space-y-4">
        {demoEntries.map((entry) => (
          <li
            key={entry.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {formatDate(entry.createdAt)}
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              {entry.title}
            </h3>
            <p className="text-sm text-slate-600">{entry.summary}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default EntriesList;
