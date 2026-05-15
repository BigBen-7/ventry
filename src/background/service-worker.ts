import type {
  Message,
  SaveJobPayload,
  UpdateStatusPayload,
  DeleteJobPayload,
  MessageResponse,
} from '../shared/types';
import { getAllJobs, saveJob, updateStatus, deleteJob } from './storage';

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    handleMessage(message)
      .then((response) => sendResponse(response))
      .catch((err: unknown) => {
        const error = err instanceof Error ? err.message : 'Unknown error';
        sendResponse({ ok: false, error } satisfies MessageResponse);
      });
    return true; // keep message channel open for async response
  }
);

async function handleMessage(message: Message): Promise<MessageResponse<unknown>> {
  switch (message.type) {
    case 'GET_JOBS': {
      const data = await getAllJobs();
      return { ok: true, data };
    }
    case 'SAVE_JOB': {
      const data = await saveJob(message.payload as SaveJobPayload);
      await updateBadge();
      return { ok: true, data };
    }
    case 'UPDATE_STATUS': {
      const { id, status } = message.payload as UpdateStatusPayload;
      const data = await updateStatus(id, status);
      await updateBadge();
      return { ok: true, data };
    }
    case 'DELETE_JOB': {
      const { id } = message.payload as DeleteJobPayload;
      await deleteJob(id);
      await updateBadge();
      return { ok: true };
    }
  }
}

async function updateBadge(): Promise<void> {
  const jobs = await getAllJobs();
  const active = jobs.filter(
    (j) => j.status !== 'offer' && j.status !== 'rejected'
  ).length;
  await chrome.action.setBadgeText({ text: active > 0 ? String(active) : '' });
  await chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
}
