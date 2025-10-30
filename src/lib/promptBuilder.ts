import { Issue, Instrument } from '@/store/assessmentStore';

export interface PromptContext {
  issue: Issue;
  instrument: Instrument;
  tempo: number;
  intensityScores: Record<'energy' | 'focus' | 'mood' | 'tension' | 'sleep', number>;
  surveyQuestions: string[];
}

export interface PromptDescription {
  prompt: string;
  promptSummary: string[];
  issueTitle: string;
  instrumentLabel: string;
}

const issueDetails: Record<Issue, { title: string; focus: string; goal: string }> = {
  anxiety: {
    title: 'Anxiety Relief',
    focus: 'calming heightened worry, tension, and restlessness',
    goal: 'deliver spacious, soothing textures that encourage deep breathing and release nervous energy',
  },
  depression: {
    title: 'Mood Lifting',
    focus: 'supporting low mood, fatigue, and a sense of hopelessness',
    goal: 'gently elevate mood with warm harmonies, patient builds, and hopeful melodic cues',
  },
  relationship: {
    title: 'Relationship Harmony',
    focus: 'easing interpersonal stress and fostering emotional openness',
    goal: 'promote empathy and connection through balanced dynamics and conversational motifs',
  },
  stress: {
    title: 'Stress Reduction',
    focus: 'reducing overwhelming pressure and mental overload',
    goal: 'ground the listener with steady rhythms, restorative harmonies, and gradual tension release',
  },
  sleep: {
    title: 'Sleep Support',
    focus: 'guiding the listener into restful, sustained sleep',
    goal: 'create a lullaby-like atmosphere with soft transitions and minimal stimulation',
  },
};

const instrumentTextures: Record<Instrument, { label: string; description: string }> = {
  piano: {
    label: 'Piano',
    description: 'warm, resonant piano textures with gentle arpeggios and soft sustain',
  },
  guitar: {
    label: 'Guitar',
    description: 'fingerstyle acoustic guitar with mellow voicings and natural resonance',
  },
  violin: {
    label: 'Violin',
    description: 'expressive violin lines with smooth legato phrasing and subtle vibrato',
  },
  flute: {
    label: 'Flute',
    description: 'airy flute melodies with flowing breaths and feather-light articulation',
  },
  synth: {
    label: 'Synthesizer',
    description: 'ambient synthesizer layers with lush pads, evolving textures, and soft pulses',
  },
};

const sliderLabels = ['Not at all', 'Slightly', 'Moderately', 'Very much', 'Extremely'];

export const buildTherapeuticPrompt = (context: PromptContext): PromptDescription => {
  const { issue, instrument, tempo, intensityScores, surveyQuestions } = context;

  const issueInfo = issueDetails[issue];
  const instrumentInfo = instrumentTextures[instrument];

  const scoreValues = Object.values(intensityScores);
  const questionSummaries = surveyQuestions.map((question, index) => {
    const rawScore = scoreValues[index] ?? 0;
    const clamped = Math.max(0, Math.min(sliderLabels.length - 1, rawScore));
    const label = sliderLabels[clamped];
    return `${index + 1}. ${question.trim()} — Response: ${label} (${rawScore}/4)`;
  });

  const prompt = [
    `Compose a ${tempo} BPM therapeutic track (~20 seconds) using ${instrumentInfo.description}.`,
    `The listener is seeking support for ${issueInfo.focus}; ${issueInfo.goal}.`,
    'Consider the following mental wellness assessment responses:',
    ...questionSummaries.map((line) => `- ${line}`),
    'Use evolving layers, smooth transitions, and avoid jarring percussion. Conclude with a gentle resolution that invites calm and grounding.',
  ].join(' ');

  return {
    prompt,
    promptSummary: questionSummaries,
    issueTitle: issueInfo.title,
    instrumentLabel: instrumentInfo.label,
  };
};
