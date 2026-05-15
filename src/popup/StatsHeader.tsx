import type { Job, Status } from '../shared/types';
import { STATUSES, STATUS_LABELS } from '../shared/constants';

interface Props {
  jobs: Job[];
}

const ACTIVE_STATUSES: Status[] = ['saved', 'applied', 'interviewing'];

export default function StatsHeader({ jobs }: Props) {
  const counts = STATUSES.reduce<Record<Status, number>>(
    (acc, s) => ({ ...acc, [s]: jobs.filter((j) => j.status === s).length }),
    {} as Record<Status, number>
  );
  const active = ACTIVE_STATUSES.reduce((sum, s) => sum + counts[s], 0);

  return (
    <header className="stats-header">
      <div className="stats-header__summary">
        <span className="stats-header__total">{active}</span>
        <span className="stats-header__label">active</span>
      </div>
      <div className="stats-header__pipeline">
        {ACTIVE_STATUSES.map((s) => (
          <div key={s} className="stats-header__pill">
            <span className="stats-header__pill-count">{counts[s]}</span>
            <span className="stats-header__pill-label">{STATUS_LABELS[s]}</span>
          </div>
        ))}
      </div>
    </header>
  );
}
