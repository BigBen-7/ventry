import type { Status } from '../shared/types';
import { STATUSES, STATUS_LABELS } from '../shared/constants';

interface Props {
  active: Status | 'all';
  onChange: (filter: Status | 'all') => void;
}

const FILTERS: Array<{ value: Status | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  ...STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
];

export default function FilterBar({ active, onChange }: Props) {
  return (
    <nav className="filter-bar">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          className={`filter-bar__btn${active === value ? ' filter-bar__btn--active' : ''}`}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
