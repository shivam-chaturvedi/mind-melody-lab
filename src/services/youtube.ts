export type YouTubeVideo = {
  title: string;
  thumbnail: string;
  link: string;
};

const getApiKey = () => {
  const key = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
  if (!key) {
    throw new Error('YouTube API key missing. Set VITE_YOUTUBE_API_KEY in your environment.');
  }
  return key;
};

const buildSearchQuery = (prompt: string): string => {
  if (!prompt) return 'calming instrumental therapy music 90 bpm';

  const lower = prompt.toLowerCase();
  const terms = new Set<string>();

  const keywordMap: Array<[RegExp, string]> = [
    [/guitar|acoustic/, 'acoustic guitar'],
    [/piano/, 'piano'],
    [/violin|strings/, 'violin instrumental'],
    [/flute/, 'flute instrumental'],
    [/synth|electronic/, 'ambient synth'],
    [/relax|calm|soothing/, 'calming music'],
    [/focus|concentrate/, 'focus instrumental'],
    [/uplift|hope|positiv/, 'uplifting music'],
    [/sleep|insomnia/, 'sleep music'],
    [/stress|anxiety/, 'stress relief music'],
    [/meditat|mindful/, 'meditation music'],
  ];

  keywordMap.forEach(([regex, term]) => {
    if (regex.test(lower)) terms.add(term);
  });

  const bpmMatch = lower.match(/(\d{2,3})\s*bpm/);
  if (bpmMatch) {
    terms.add(`${bpmMatch[1]} bpm`);
  }

  if (!terms.size) {
    terms.add('calming instrumental');
  }

  // keep query compact for better search relevance
  return Array.from(terms).slice(0, 6).join(' ');
};

export const searchYouTube = async (
  prompt: string,
  maxResults = 6
): Promise<{ searchQuery: string; videos: YouTubeVideo[] }> => {
  const key = getApiKey();
  const searchQuery = buildSearchQuery(prompt);

  const params = new URLSearchParams({
    part: 'snippet',
    q: searchQuery,
    type: 'video',
    maxResults: String(maxResults),
    key,
    videoEmbeddable: 'true',
    videoSyndicated: 'true',
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }

  const data = await response.json();
  const items = (data.items ?? []) as Array<{
    id?: { videoId?: string };
    snippet?: {
      title?: string;
      thumbnails?: { medium?: { url?: string }; high?: { url?: string }; default?: { url?: string } };
    };
  }>;

  const videos: YouTubeVideo[] = items
    .map((item) => {
      const videoId = item.id?.videoId ?? '';
      const title = item.snippet?.title ?? 'Untitled';
      const thumbnail =
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.default?.url ||
        '';
      const link = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '';
      return { title, thumbnail, link };
    })
    .filter((video) => Boolean(video.link));

  return { searchQuery, videos };
};
