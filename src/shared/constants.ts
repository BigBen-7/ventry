import type { Status } from './types';

export const STORAGE_KEY = 'ventry_jobs';

export const STATUSES: Status[] = [
  'saved',
  'applied',
  'interviewing',
  'offer',
  'rejected',
];

export const STATUS_LABELS: Record<Status, string> = {
  saved: 'Saved',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
};

export const STATUS_TRANSITIONS: Record<Status, Status[]> = {
  saved: ['applied', 'rejected'],
  applied: ['interviewing', 'rejected'],
  interviewing: ['offer', 'rejected'],
  offer: [],
  rejected: [],
};
