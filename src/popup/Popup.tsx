import { useEffect, useReducer, useState } from 'react';
import type { Job, Status, MessageResponse, SaveJobPayload } from '../shared/types';
import StatsHeader from './StatsHeader';
import FilterBar from './FilterBar';
import JobCard from './JobCard';

type Filter = Status | 'all';

type State =
  | { phase: 'loading' }
  | { phase: 'error'; message: string }
  | { phase: 'ready'; jobs: Job[] };

type Action =
  | { type: 'LOADED'; jobs: Job[] }
  | { type: 'ERROR'; message: string }
  | { type: 'UPSERT'; job: Job }
  | { type: 'REMOVE'; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADED':
      return { phase: 'ready', jobs: action.jobs };
    case 'ERROR':
      return { phase: 'error', message: action.message };
    case 'UPSERT': {
      if (state.phase !== 'ready') return state;
      const exists = state.jobs.some((j) => j.id === action.job.id);
      const jobs = exists
        ? state.jobs.map((j) => (j.id === action.job.id ? action.job : j))
        : [action.job, ...state.jobs];
      return { ...state, jobs };
    }
    case 'REMOVE': {
      if (state.phase !== 'ready') return state;
      return { ...state, jobs: state.jobs.filter((j) => j.id !== action.id) };
    }
  }
}

async function sendMessage<T>(message: object): Promise<T> {
  const response = await chrome.runtime.sendMessage<object, MessageResponse<T>>(message);
  if (!response.ok) throw new Error(response.error ?? 'Unknown error');
  return response.data as T;
}

export default function Popup() {
  const [state, dispatch] = useReducer(reducer, { phase: 'loading' });
  const [filter, setFilter] = useState<Filter>('all');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    sendMessage<Job[]>({ type: 'GET_JOBS' })
      .then((jobs) => dispatch({ type: 'LOADED', jobs }))
      .catch((err: unknown) =>
        dispatch({ type: 'ERROR', message: err instanceof Error ? err.message : 'Failed to load' })
      );
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) throw new Error('No active tab');

      let payload: SaveJobPayload;
      try {
        payload = await chrome.tabs.sendMessage<object, SaveJobPayload>(tab.id, { type: 'SCRAPE' });
      } catch {
        payload = {
          title: tab.title?.trim() || 'Untitled',
          company: new URL(tab.url ?? 'http://unknown').hostname.replace(/^www\./, ''),
          url: tab.url ?? '',
        };
      }

      const job = await sendMessage<Job>({ type: 'SAVE_JOB', payload });
      dispatch({ type: 'UPSERT', job });
    } catch (err: unknown) {
      dispatch({ type: 'ERROR', message: err instanceof Error ? err.message : 'Failed to save' });
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id: string, status: Status) {
    try {
      const job = await sendMessage<Job>({ type: 'UPDATE_STATUS', payload: { id, status } });
      dispatch({ type: 'UPSERT', job });
    } catch (err: unknown) {
      console.error('Status update failed', err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await sendMessage({ type: 'DELETE_JOB', payload: { id } });
      dispatch({ type: 'REMOVE', id });
    } catch (err: unknown) {
      console.error('Delete failed', err);
    }
  }

  const jobs = state.phase === 'ready' ? state.jobs : [];
  const visible = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <div className="popup">
      <div className="popup__topbar">
        <h1 className="popup__brand">Ventry</h1>
        <button className="popup__save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save job'}
        </button>
      </div>

      {state.phase === 'ready' && <StatsHeader jobs={jobs} />}

      <FilterBar active={filter} onChange={setFilter} />

      <main className="popup__list">
        {state.phase === 'loading' && (
          <p className="popup__status-msg">Loading…</p>
        )}
        {state.phase === 'error' && (
          <p className="popup__status-msg popup__status-msg--error">{state.message}</p>
        )}
        {state.phase === 'ready' && visible.length === 0 && (
          <p className="popup__status-msg">No jobs here yet.</p>
        )}
        {visible.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </main>
    </div>
  );
}
