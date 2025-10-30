import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Issue = 'anxiety' | 'depression' | 'relationship' | 'stress' | 'sleep';
export type Instrument = 'piano' | 'guitar' | 'violin' | 'flute' | 'synth';

interface IntensityScores {
  energy: number;
  focus: number;
  mood: number;
  tension: number;
  sleep: number;
}

interface AssessmentState {
  // Step 1: Issue Selection
  selectedIssue: Issue | null;
  setSelectedIssue: (issue: Issue) => void;

  // Step 2: Intensity Scores
  intensityScores: IntensityScores;
  setIntensityScore: (key: keyof IntensityScores, value: number) => void;

  // Step 3: Instrument & Tempo
  selectedInstrument: Instrument | null;
  setSelectedInstrument: (instrument: Instrument) => void;
  tempo: number;
  setTempo: (tempo: number) => void;

  // Results
  generatedTrackUrl: string | null;
  setGeneratedTrackUrl: (url: string | null) => void;
  feedback: string;
  setFeedback: (feedback: string) => void;

  // Wizard navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Reset
  reset: () => void;
}

const initialState = {
  selectedIssue: null,
  intensityScores: {
    energy: 2,
    focus: 2,
    mood: 2,
    tension: 2,
    sleep: 2,
  },
  selectedInstrument: null,
  tempo: 120,
  generatedTrackUrl: null,
  feedback: '',
  currentStep: 1,
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedIssue: (issue) => set({ selectedIssue: issue }),

      setIntensityScore: (key, value) =>
        set((state) => ({
          intensityScores: { ...state.intensityScores, [key]: value },
        })),

      setSelectedInstrument: (instrument) => set({ selectedInstrument: instrument }),
      setTempo: (tempo) => set({ tempo }),

      setGeneratedTrackUrl: (url) => set({ generatedTrackUrl: url }),
      setFeedback: (feedback) => set({ feedback }),

      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      reset: () => set(initialState),
    }),
    {
      name: 'melody-matrix-assessment',
    }
  )
);
