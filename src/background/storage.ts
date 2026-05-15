import type { Job, Status, SaveJobPayload } from '../shared/types';
import { STORAGE_KEY } from '../shared/constants';

async function readAll(): Promise<Job[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as Job[]) ?? [];
}

async function writeAll(jobs: Job[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: jobs });
}

export async function getAllJobs(): Promise<Job[]> {
  return readAll();
}

export async function saveJob(payload: SaveJobPayload): Promise<Job> {
  const jobs = await readAll();
  const now = Date.now();
  const job: Job = {
    id: crypto.randomUUID(),
    title: payload.title,
    company: payload.company,
    url: payload.url,
    status: 'saved',
    savedAt: now,
    updatedAt: now,
  };
  await writeAll([job, ...jobs]);
  return job;
}

export async function updateStatus(id: string, status: Status): Promise<Job> {
  const jobs = await readAll();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) throw new Error(`Job ${id} not found`);
  const updated: Job = { ...jobs[index], status, updatedAt: Date.now() };
  jobs[index] = updated;
  await writeAll(jobs);
  return updated;
}

export async function deleteJob(id: string): Promise<void> {
  const jobs = await readAll();
  await writeAll(jobs.filter((j) => j.id !== id));
}
