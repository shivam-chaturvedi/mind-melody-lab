/**
 * Beatoven API Service
 *
 * Mirrors the Streamlit backend logic in generate1.py so the React app can
 * trigger real compositions via the Beatoven public API.
 */

export interface ComposeRequest {
  prompt: string;
  instrument: string;
  tempo: number;
  format?: 'wav' | 'mp3' | 'aac';
  looping?: boolean;
}

interface BeatovenComposeResponse {
  status: string;
  task_id: string;
  track_id?: string;
  version?: number;
}

interface BeatovenTaskMeta {
  track_url?: string;
}

interface BeatovenTaskResponse {
  id: string;
  status: string;
  meta?: BeatovenTaskMeta;
}

export interface TaskStatus {
  taskId: string;
  status: 'queued' | 'composing' | 'completed' | 'succeeded' | 'failed';
  audioUrl?: string;
}

const API_BASE_URL =
  (import.meta.env.VITE_BEATOVEN_API_URL as string | undefined) ??
  'https://public-api.beatoven.ai';

const normalizeBaseUrl = (url: string) => url.replace(/\/$/, '');
const API_V1_BASE = `${normalizeBaseUrl(API_BASE_URL)}/api/v1`;

const BACKEND_API_HEADER_KEY = import.meta.env.VITE_BEATOVEN_API_KEY;

const authHeaders = () => {
  if (!BACKEND_API_HEADER_KEY) {
    throw new Error('Beatoven API key is missing. Set VITE_BEATOVEN_API_KEY in your environment.');
  }

  return {
    Authorization: `Bearer ${BACKEND_API_HEADER_KEY}`,
    'Content-Type': 'application/json',
  };
};

export const composeTrack = async (request: ComposeRequest): Promise<string> => {
  const payload: Record<string, unknown> = {
    prompt: {
      text: request.prompt,
    },
  };

  payload.format = request.format ?? 'wav';
  if (typeof request.looping === 'boolean') {
    payload.looping = request.looping;
  }

  const response = await fetch(`${API_V1_BASE}/tracks/compose`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await safeJson(response);
    throw new Error(
      `Beatoven compose failed (${response.status}): ${JSON.stringify(errorBody ?? response.statusText)}`
    );
  }

  const data = (await response.json()) as BeatovenComposeResponse;

  if (!data.task_id) {
    throw new Error('Beatoven compose response missing task_id');
  }

  return data.task_id;
};

export const getTrackStatus = async (taskId: string): Promise<TaskStatus> => {
  const response = await fetch(`${API_V1_BASE}/tasks/${taskId}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorBody = await safeJson(response);
    throw new Error(
      `Beatoven status failed (${response.status}): ${JSON.stringify(errorBody ?? response.statusText)}`
    );
  }

  const data = (await response.json()) as BeatovenTaskResponse;

  const audioUrl = extractAudioUrl(data.meta);
  const rawStatus = (data.status ?? 'queued').toLowerCase();
  const normalizedStatus = normalizeStatus(rawStatus);

  return {
    taskId: data.id ?? taskId,
    status: normalizedStatus,
    audioUrl,
  };
};

/**
 * Complete workflow to generate music (compose -> poll -> download)
 */
export const generateMusic = async (
  request: ComposeRequest,
  onProgress?: (status: string, progress: number) => void
): Promise<string> => {
  try {
    onProgress?.('🎼 Starting composition...', 5);
    const taskId = await composeTrack(request);

    let interval = 10000;
    let attempts = 0;
    const maxAttempts = 45;

    while (attempts < maxAttempts) {
      attempts += 1;

      const status = await getTrackStatus(taskId);
      const progressHint = Math.min(90, 10 + attempts * 2.5);

      if (status.status === 'queued') {
        onProgress?.('🎼 Preparing orchestration and sound palette...', progressHint);
      } else {
        onProgress?.('🎵 Composing your personalized track...', progressHint);
      }

      if (status.status === 'failed') {
        throw new Error('Beatoven reported the composition failed');
      }

      if ((status.status === 'completed' || status.status === 'succeeded') && status.audioUrl) {
        onProgress?.('🎧 Music ready!', 100);
        return status.audioUrl;
      }

      // backoff similar to Python watch_task_status
      await wait(interval);
      interval = Math.max(3000, interval - 1500);
    }

    throw new Error('Music generation timed out before completion');
  } catch (error) {
    console.error('[Beatoven] Error generating music:', error);
    throw error;
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const safeJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const extractAudioUrl = (meta?: BeatovenTaskMeta): string | undefined => {
  if (!meta) return undefined;
  if (meta.track_url) return meta.track_url;

  // Some responses may return assets array containing download URLs
  const assets = (meta as any).assets ?? (meta as any).tracks ?? [];
  if (Array.isArray(assets)) {
    const match = assets.find((item) => typeof item?.url === 'string' || typeof item?.download_url === 'string');
    return match?.url ?? match?.download_url;
  }

  return undefined;
};

const normalizeStatus = (status: string): TaskStatus['status'] => {
  switch (status) {
    case 'composed':
    case 'completed':
      return 'completed';
    case 'succeeded':
      return 'succeeded';
    case 'running':
    case 'processing':
      return 'composing';
    case 'queued':
    case 'pending':
    case 'waiting':
      return 'queued';
    case 'composing':
      return 'composing';
    case 'failed':
      return 'failed';
    default:
      return 'queued';
  }
};
