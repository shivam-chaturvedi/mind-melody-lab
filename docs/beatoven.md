# Beatoven.ai Track Composition API

Melody Matrix now uses Beatoven.ai's public REST endpoints to compose therapeutic tracks. Instead of streaming PCM over WebSockets, the app POSTs a prompt and polls the task status until Beatoven returns the finished assets.

## Quick reference

- **Base URL:** `https://public-api.beatoven.ai`
- **Auth:** `Authorization: Bearer <VITE_BEATOVEN_API_TOKEN>`
- **Content-Type:** `application/json`
- **Environment variable:** add `VITE_BEATOVEN_API_TOKEN` to `.env`

## Composition flow

1. **POST `/api/v1/tracks/compose`**
   - Payload example:
     ```json
     {
       "prompt": { "text": "30 seconds peaceful lo-fi chill hop track" },
       "format": "wav",
       "looping": false
     }
     ```
   - The response returns `status` and a `task_id` once the asynchronous job starts.
2. **Poll `/api/v1/tasks/<task_id>`**
   - Repeat GET requests until the status becomes `composed` (or `failed`).
   - **Statuses:**
     - `composing` – queued
     - `running` – actively mixing
     - `composed` – assets ready
     - `failed` – something went wrong
   - A successful response includes `meta.track_url` and optional `stems_url` (e.g., bass, chords, melody, percussion).

## Implementation notes

- The client includes `onProgress` callbacks to surface status updates (e.g., composing → running → composed) and maps them to UX progress values.
- Polling uses a short interval and bails out after a configurable number of attempts, surfacing errors if Beatoven never finishes.
- The final track URL is returned whenever `meta.track_url` is present.
- You can adjust `format` (`wav`, `mp3`, `aac`) and `looping` to control how the track is generated.

## Environment

Set the token in `.env` before starting the dev server:

```env
VITE_BEATOVEN_API_TOKEN="<YOUR_TOKEN>"
```

This token is appended as a bearer credential on every request, so keep it secret and never commit it to version control.
