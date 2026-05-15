import type { Job, Status } from '../shared/types';
import { STATUSES, STATUS_LABELS, STATUS_TRANSITIONS } from '../shared/constants';

interface Props {
  job: Job;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}

function relativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function JobCard({ job, onStatusChange, onDelete }: Props) {
  const transitions = STATUS_TRANSITIONS[job.status];
  const isTerminal = transitions.length === 0;

  return (
    <article className={`job-card job-card--${job.status}`}>
      <div className="job-card__header">
        <div className="job-card__meta">
          <a
            className="job-card__title"
            href={job.url}
            target="_blank"
            rel="noreferrer"
          >
            {job.title}
          </a>
          <span className="job-card__company">{job.company}</span>
        </div>
        <button
          className="job-card__delete"
          onClick={() => onDelete(job.id)}
          aria-label="Delete job"
        >
          ×
        </button>
      </div>

      <div className="job-card__footer">
        <span className="job-card__time">{relativeTime(job.savedAt)}</span>
        <select
          className="job-card__status"
          value={job.status}
          disabled={isTerminal}
          onChange={(e) => onStatusChange(job.id, e.target.value as Status)}
        >
          <option value={job.status}>{STATUS_LABELS[job.status]}</option>
          {transitions.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}

