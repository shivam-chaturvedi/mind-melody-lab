import { GoogleGenAI, MusicGenerationMode } from '@google/genai';
import type {
  LiveMusicCallbacks,
  LiveMusicFilteredPrompt,
  LiveMusicGenerationConfig,
  LiveMusicServerMessage,
  LiveMusicSession,
  WeightedPrompt,
} from '@google/genai';

type ProgressCallback = (status: string, progress: number) => void;

export interface ComposeRequest {
  prompt: string;
  instrument?: string;
  tempo?: number;
}

export interface GenerateMusicOptions {
  durationSeconds?: number;
  bpm?: number;
  density?: number;
  brightness?: number;
  guidance?: number;
  temperature?: number;
  scale?: LiveMusicGenerationConfig['scale'];
  musicGenerationMode?: MusicGenerationMode;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('Gemini API key missing. Set VITE_GEMINI_API_KEY in your environment.');
}

const LYRIA_MODEL = 'models/lyria-realtime-exp';
const SAMPLE_RATE = 48000;
const CHANNELS = 2;
const BITS_PER_SAMPLE = 16;
const DEFAULT_DURATION_SECONDS = 10;
const MIN_DURATION_SECONDS = 8;
const MAX_DURATION_SECONDS = 10;

const aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY, apiVersion: 'v1alpha' });

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const durationBetween = (input?: number) =>
  clamp(input ?? DEFAULT_DURATION_SECONDS, MIN_DURATION_SECONDS, MAX_DURATION_SECONDS);

const decodeBase64Chunk = (chunk: string): Uint8Array => {
  const decoder = typeof atob === 'function' ? atob : undefined;
  if (!decoder) {
    throw new Error('Base64 decoding is not available in this environment.');
  }

  const binary = decoder(chunk);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
};

const buildWavHeader = (
  dataLength: number,
  sampleRate: number,
  numChannels: number,
  bitsPerSample: number
): ArrayBuffer => {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  return header;
};

const combineChunks = (chunks: Uint8Array[]): Uint8Array => {
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return combined;
};

const createMusicConfig = (
  request: ComposeRequest,
  options?: GenerateMusicOptions
): LiveMusicGenerationConfig => {
  const config: LiveMusicGenerationConfig = {};

  const bpm = options?.bpm ?? request.tempo;
  if (bpm) {
    config.bpm = clamp(Math.round(bpm), 60, 200);
  }

  if (options?.density !== undefined) {
    config.density = clamp(options.density, 0, 1);
  }

  if (options?.brightness !== undefined) {
    config.brightness = clamp(options.brightness, 0, 1);
  }

  if (options?.guidance !== undefined) {
    config.guidance = clamp(options.guidance, 0, 6);
  }

  if (options?.temperature !== undefined) {
    config.temperature = clamp(options.temperature, 0, 3);
  }

  if (options?.scale) {
    config.scale = options.scale;
  }

  config.musicGenerationMode =
    options?.musicGenerationMode ?? MusicGenerationMode.QUALITY;

  return config;
};

const WEBSOCKET_OPEN = 1;
const WEBSOCKET_CLOSED = 3;

const isSessionOpen = (session?: LiveMusicSession): boolean => {
  const ws = session?.conn;
  return Boolean(ws && ws.readyState === WEBSOCKET_OPEN);
};

const isSessionClosed = (session?: LiveMusicSession): boolean => {
  const ws = session?.conn;
  if (!ws) return true;
  return ws.readyState === WEBSOCKET_CLOSED;
};

const safeStopSession = (session?: LiveMusicSession) => {
  if (!session || isSessionClosed(session)) {
    return;
  }

  if (isSessionOpen(session)) {
    try {
      session.stop();
    } catch (error) {
      console.warn('Error sending stop to Lyria session:', error);
    }
  }

  const ws = session.conn;
  if (ws && ws.readyState !== ws.CLOSED) {
    try {
      session.close();
    } catch (error) {
      console.warn('Error closing Lyria session:', error);
    }
  }
};

const sanitizePrompt = (prompt: string, instrument?: string): string => {
  const disallowed = /^(make|generate|music)$/i;
  const words = prompt
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => !!word && !disallowed.test(word));

  if (instrument) {
    const instrumentWords = instrument
      .split(/\s+/)
      .map((word) => word.trim())
      .filter(Boolean);

    for (const instWord of instrumentWords) {
      if (!words.includes(instWord)) {
        words.push(instWord);
      }
    }
  }

  return words.join(' ').trim();
};

export const generateMusic = async (
  request: ComposeRequest,
  onProgress?: ProgressCallback,
  options?: GenerateMusicOptions
): Promise<string> => {
  const prompt = request.prompt.trim();
  if (!prompt) {
    throw new Error('Prompt is required to generate music.');
  }

  onProgress?.('Connecting to Lyria...', 5);

  const durationMs = 10000;
  const audioChunks: Uint8Array[] = [];

  let session: LiveMusicSession | undefined;
  let firstChunkReceived = false;
  let stopTimer: number | undefined;
  let hardTimeout: number | undefined;

  let resolveCompletion!: () => void;
  let rejectCompletion!: (error: Error) => void;

  const completionPromise = new Promise<void>((resolve, reject) => {
    resolveCompletion = resolve;
    rejectCompletion = reject;
  });

  const callbacks: LiveMusicCallbacks = {
    onmessage: (message: LiveMusicServerMessage) => {
      const chunks = message.serverContent?.audioChunks;
      if (!chunks?.length) return;

      if (!firstChunkReceived) {
        firstChunkReceived = true;

        onProgress?.('Streaming audio...', 30);

        stopTimer = window.setTimeout(() => {
          session?.stop();
          session?.close();
        }, durationMs);

        if (hardTimeout) clearTimeout(hardTimeout);
      }

      for (const chunk of chunks) {
        if (!chunk.data) continue;
        audioChunks.push(decodeBase64Chunk(chunk.data));
      }
    },

    onerror: (event) => {
      const error =
        event?.error instanceof Error
          ? event.error
          : new Error(event?.message ?? 'Streaming error.');
      rejectCompletion(error);
    },

    onclose: () => {
      resolveCompletion();
    },
  };

  session = await aiClient.live.music.connect({
    model: LYRIA_MODEL,
    callbacks,
  });

  await session.setWeightedPrompts({
    weightedPrompts: [{ text: prompt, weight: 1 }],
  });

  await session.setMusicGenerationConfig({
    musicGenerationConfig: createMusicConfig(request, options),
  });

  session.play();

  hardTimeout = window.setTimeout(() => {
    rejectCompletion(new Error('Lyria timed out.'));
    session?.stop();
    session?.close();
  }, 20000);

  await completionPromise;

  if (stopTimer) clearTimeout(stopTimer);
  if (hardTimeout) clearTimeout(hardTimeout);

  if (!audioChunks.length) {
    throw new Error('No audio received.');
  }

  const combinedAudio = combineChunks(audioChunks);
  const header = buildWavHeader(
    combinedAudio.length,
    SAMPLE_RATE,
    CHANNELS,
    BITS_PER_SAMPLE
  );

  const wavBlob = new Blob([header, combinedAudio], {
    type: 'audio/wav',
  });

  onProgress?.('Track ready', 100);

  return URL.createObjectURL(wavBlob);
};
