export type Status = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface Job {
  id: string;
  title: string;
  company: string;
  url: string;
  status: Status;
  savedAt: number;
  updatedAt: number;
}

export type MessageType = 'SAVE_JOB' | 'GET_JOBS' | 'UPDATE_STATUS' | 'DELETE_JOB';

export interface Message {
  type: MessageType;
  payload?: unknown;
}

export interface SaveJobPayload {
  title: string;
  company: string;
  url: string;
}

export interface UpdateStatusPayload {
  id: string;
  status: Status;
}

export interface DeleteJobPayload {
  id: string;
}

export interface MessageResponse<T = void> {
  ok: boolean;
  data?: T;
  error?: string;
}
