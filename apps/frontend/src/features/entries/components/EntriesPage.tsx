import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useMemo, useState } from 'react';

type EntryStatus = 'PLANNED' | 'IN_PROGRESS' | 'DONE';

type Entry = {
  id: string;
  title: string;
  summary: string;
  content?: string | null;
  status?: EntryStatus | null;
  createdAt: string;
  updatedAt: string;
};

type EntryPayload = {
  title: string;
  summary: string;
  content?: string;
  status?: EntryStatus;
};

type UpdatePayload = {
  id: string;
  values: EntryPayload;
};

const statusOptions: EntryStatus[] = ['PLANNED', 'IN_PROGRESS', 'DONE'];

const statusLabel = (status: EntryStatus) =>
  status.replace(/_/g, ' ');

const apiBaseUrl = (() => {
  const base = import.meta.env?.VITE_API_BASE_URL ?? '/api';
  return base.endsWith('/') ? base.slice(0, -1) : base;
})();

const buildApiUrl = (path: string) => `${apiBaseUrl}${path}`;

const readErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();
    if (payload && typeof payload.message === 'string') {
      return payload.message;
    }
  } catch (error) {
    // Ignore JSON parse errors and fall back to a default message.
  }
  return 'Something went wrong. Please try again.';
};

const fetchEntries = async (): Promise<Entry[]> => {
  const response = await fetch(buildApiUrl('/entries'));
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json();
};

const createEntry = async (values: EntryPayload) => {
  const response = await fetch(buildApiUrl('/entries'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json() as Promise<Entry>;
};

const updateEntry = async ({ id, values }: UpdatePayload) => {
  const response = await fetch(buildApiUrl(`/entries/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json() as Promise<Entry>;
};

const deleteEntry = async (id: string) => {
  const response = await fetch(buildApiUrl(`/entries/${id}`), {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
};

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
    new Date(isoDate),
  );

const initialFormState = {
  title: '',
  summary: '',
  content: '',
  status: 'PLANNED' as EntryStatus,
};

type FormState = typeof initialFormState;

const EntriesPage = () => {
  const queryClient = useQueryClient();
  const { data: entries, isLoading, isError, error } = useQuery({
    queryKey: ['entries'],
    queryFn: fetchEntries,
  });

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      setFormState(initialFormState);
      setFormError(null);
    },
    onError: (mutationError: unknown) => {
      setFormError(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unable to save the entry.',
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      setFormState(initialFormState);
      setEditingId(null);
      setFormError(null);
    },
    onError: (mutationError: unknown) => {
      setFormError(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unable to save the entry.',
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onMutate: (id: string) => {
      setDeletingId(id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      if (editingId === id) {
        setEditingId(null);
        setFormState(initialFormState);
      }
    },
    onError: (mutationError: unknown) => {
      setFormError(
        mutationError instanceof Error
          ? mutationError.message
          : 'Unable to delete the entry.',
      );
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFormState((previous) => ({
      ...previous,
      status: value as EntryStatus,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const payload: EntryPayload = {
      title: formState.title.trim(),
      summary: formState.summary.trim(),
      content: formState.content.trim() || undefined,
      status: formState.status,
    };

    if (!payload.title || !payload.summary) {
      setFormError('Title and summary are required.');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, values: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const startEditing = (entry: Entry) => {
    setEditingId(entry.id);
    setFormState({
      title: entry.title,
      summary: entry.summary,
      content: entry.content ?? '',
      status: (entry.status as EntryStatus | null) ?? 'PLANNED',
    });
    setFormError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormState(initialFormState);
    setFormError(null);
  };

  const entriesToDisplay = useMemo(() => {
    if (!entries) {
      return [];
    }
    return entries;
  }, [entries]);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-slate-500">
          Learning journal
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Entries overview
        </h2>
        <p className="text-sm text-slate-500">
          Review existing entries, create new notes, or update their status as
          your work progresses.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Entries
            </h3>
          </div>
          <div className="relative min-h-[200px] overflow-x-auto">
            {isLoading && (
              <div className="flex h-full items-center justify-center p-6 text-sm text-slate-500">
                Loading entries…
              </div>
            )}

            {isError && (
              <div className="flex h-full items-center justify-center p-6 text-sm text-rose-600">
                {error instanceof Error
                  ? error.message
                  : 'Unable to load entries.'}
              </div>
            )}

            {!isLoading && !isError && entriesToDisplay.length === 0 && (
              <div className="flex h-full items-center justify-center p-6 text-sm text-slate-500">
                No entries yet. Add your first learning note using the form on the
                right.
              </div>
            )}

            {!isLoading && !isError && entriesToDisplay.length > 0 && (
              <table className="w-full min-w-[480px] divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Created</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {entriesToDisplay.map((entry) => (
                    <tr key={entry.id} className="align-top">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{entry.title}</div>
                        <div className="text-xs text-slate-500">{entry.summary}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                          {statusLabel(
                            (entry.status as EntryStatus | null) ?? 'PLANNED',
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-sm">
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => startEditing(entry)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="font-medium text-rose-600 hover:text-rose-500"
                            onClick={() => deleteMutation.mutate(entry.id)}
                            disabled={deletingId === entry.id}
                          >
                            {deletingId === entry.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            {editingId ? 'Edit entry' : 'Add a new entry'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Keep track of what you are learning and update the status as your
            understanding grows.
          </p>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formState.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="e.g. Explore React Query"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="summary">
                Summary
              </label>
              <input
                id="summary"
                name="summary"
                type="text"
                value={formState.summary}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="High-level takeaway"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="content">
                Notes
              </label>
              <textarea
                id="content"
                name="content"
                value={formState.content}
                onChange={handleChange}
                className="min-h-[96px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Add optional context or links"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formState.status}
                onChange={handleStatusChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                disabled={isSubmitting}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            {formError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {formError}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving…' : editingId ? 'Save changes' : 'Add entry'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={cancelEditing}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EntriesPage;
