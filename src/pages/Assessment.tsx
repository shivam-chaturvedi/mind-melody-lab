import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore, Issue, Instrument } from '@/store/assessmentStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IssueCard } from '@/components/IssueCard';
import { IntensitySlider } from '@/components/IntensitySlider';
import { InstrumentCard } from '@/components/InstrumentCard';
import { Slider } from '@/components/ui/slider';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Loader2, Home, RefreshCw } from 'lucide-react';
import { generateMusic } from '@/services/beatoven';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { FloatingParticles } from '@/components/FloatingParticles';
import { MusicVisualizer3D } from '@/components/MusicVisualizer3D';

const issues = [
  { 
    id: 'anxiety' as Issue, 
    emoji: '😰', 
    title: 'Anxiety',
    subtitle: 'For feelings of nervousness, worry, panic, or restlessness'
  },
  { 
    id: 'depression' as Issue, 
    emoji: '😔', 
    title: 'Depression',
    subtitle: 'For low mood, sadness, lack of motivation, hopelessness, or fatigue'
  },
  { 
    id: 'relationship' as Issue, 
    emoji: '👥', 
    title: 'Relationship',
    subtitle: 'For challenges in personal or professional relationships'
  },
  { 
    id: 'stress' as Issue, 
    emoji: '😫', 
    title: 'Stress',
    subtitle: 'For overwhelming pressure or difficulty coping'
  },
  { 
    id: 'sleep' as Issue, 
    emoji: '😴', 
    title: 'Sleep Issues',
    subtitle: 'For trouble falling/staying asleep or insomnia'
  },
];

const instruments = [
  { id: 'piano' as Instrument, emoji: '🎹', name: 'Piano', description: 'Calming and expressive' },
  { id: 'guitar' as Instrument, emoji: '🎸', name: 'Guitar', description: 'Warm and soothing' },
  { id: 'violin' as Instrument, emoji: '🎻', name: 'Violin', description: 'Emotional and uplifting' },
  { id: 'flute' as Instrument, emoji: '🪈', name: 'Flute', description: 'Light and delicate' },
  { id: 'synth' as Instrument, emoji: '🎹', name: 'Synthesizer', description: 'Modern and ambient' },
];

const assessmentQuestions = [
  'Do you feel sad, hopeless, helpless, or worthless?',
  'Do you feel guilty or blame yourself for things in your life?',
  'Have you found it difficult to engage in work, hobbies, or daily activities?',
  'Have you been experiencing trouble sleeping?',
  'Do you feel tense or worried about minor matters?',
];

const Assessment = () => {
  const navigate = useNavigate();
  const {
    selectedIssue,
    setSelectedIssue,
    intensityScores,
    setIntensityScore,
    selectedInstrument,
    setSelectedInstrument,
    tempo,
    setTempo,
    generatedTrackUrl,
    setGeneratedTrackUrl,
    feedback,
    setFeedback,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    reset,
  } = useAssessmentStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerateMusic = async () => {
    if (!selectedIssue || !selectedInstrument) {
      toast.error('Please complete all selections');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('Initializing music generation...');
    setGenerationProgress(0);

    try {
      const prompt = `Create therapeutic music for ${selectedIssue} with ${selectedInstrument} at ${tempo} BPM`;
      
      const audioUrl = await generateMusic(
        {
          prompt,
          instrument: selectedInstrument,
          tempo,
          duration: 180,
        },
        (status, progress) => {
          setGenerationStatus(status);
          setGenerationProgress(progress);
        }
      );

      setGeneratedTrackUrl(audioUrl);
      nextStep();
      
      // Celebrate!
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#7C4DFF', '#FF4081', '#B388FF', '#FF80AB'],
      });
      
      toast.success('Your personalized music is ready! 🎵');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate music. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    reset();
    setCurrentStep(1);
    toast.info('Assessment reset. Start fresh!');
  };

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      toast.success('Thank you for your feedback! 💜');
    } else {
      toast.error('Please share your thoughts before submitting');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-thin mb-6 text-foreground tracking-tight">
                Please select the mental wellness area you'd like to address.
              </h2>
              <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                Choose the focus area that resonates most with your current needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {issues.map((issue) => (
                <Card
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue.id)}
                  className={`cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    selectedIssue === issue.id
                      ? 'ring-4 ring-primary shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5'
                      : 'hover:ring-2 hover:ring-primary/50 bg-card'
                  }`}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`text-7xl mb-4 transition-transform duration-300 ${
                      selectedIssue === issue.id ? 'scale-125' : ''
                    }`}>
                      {issue.emoji}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{issue.title}</h3>
                    <p className="text-sm text-muted-foreground font-light">{issue.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={nextStep}
                disabled={!selectedIssue}
                className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Next: Assessment Questions
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        );

      case 2:
        const scoreKeys = Object.keys(intensityScores) as Array<keyof typeof intensityScores>;
        
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-thin mb-6 text-foreground tracking-tight">
                Mental Wellness Assessment
              </h2>
              <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto mb-4">
                Please answer the following questions about your experience with <span className="font-semibold text-foreground">{selectedIssue}</span>.
              </p>
              <p className="text-md text-muted-foreground font-light max-w-2xl mx-auto">
                Your responses help our AI create music tailored to your needs.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto mb-12">
              <CardContent className="p-8 space-y-8">
                {scoreKeys.map((key, index) => (
                  <IntensitySlider
                    key={key}
                    label={`${index + 1}. ${assessmentQuestions[index]}`}
                    value={intensityScores[key]}
                    onChange={(value) => setIntensityScore(key, value)}
                  />
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                size="lg"
                variant="outline"
                onClick={prevStep}
                className="gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Button>
              <Button
                size="lg"
                onClick={nextStep}
                className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Next: Customize Music
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-thin mb-6 text-foreground tracking-tight">
                Select your preferred instrument and tempo
              </h2>
              <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                Choose the sound and pace that feels right for your therapeutic music
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 mb-12">
              {/* Instruments */}
              <div>
                <h3 className="text-xl font-display font-light mb-6 text-foreground">Instrument</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {instruments.map((instrument) => (
                    <Card
                      key={instrument.id}
                      onClick={() => setSelectedInstrument(instrument.id)}
                      className={`cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg ${
                        selectedInstrument === instrument.id
                          ? 'ring-4 ring-secondary shadow-xl bg-gradient-to-br from-secondary/10 to-primary/10'
                          : 'hover:ring-2 hover:ring-secondary/50 bg-card'
                      }`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`text-5xl mb-3 transition-transform duration-300 ${
                          selectedInstrument === instrument.id ? 'scale-110' : ''
                        }`}>
                          {instrument.emoji}
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">{instrument.name}</p>
                        <p className="text-xs text-muted-foreground font-light">{instrument.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Tempo */}
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-display font-light text-foreground">Tempo</h3>
                      <span className="text-lg font-bold px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground">
                        {tempo} BPM
                      </span>
                    </div>
                    <Slider
                      value={[tempo]}
                      onValueChange={([value]) => setTempo(value)}
                      min={60}
                      max={180}
                      step={5}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground font-light">
                      <div className="text-left">
                        <p className="font-medium">60-80 BPM</p>
                        <p className="text-xs">Relaxation/Sleep</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">80-120 BPM</p>
                        <p className="text-xs">Stress Relief/Balance</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">120-180 BPM</p>
                        <p className="text-xs">Focus/Motivation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button
                size="lg"
                variant="outline"
                onClick={prevStep}
                className="gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleGenerateMusic}
                disabled={!selectedInstrument || isGenerating}
                className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity px-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating... {generationProgress}%
                  </>
                ) : (
                  <>
                    Generate My Music
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>

            {/* Generation Status */}
            {isGenerating && (
              <Card className="mt-8 border-primary/50 bg-primary/5 animate-pulse-glow">
                <CardContent className="p-6 text-center">
                  <p className="text-lg font-light text-foreground mb-4">{generationStatus}</p>
                  <div className="space-y-2">
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground font-light">
                      <p>🎼 Analyzing your mental wellness assessment...</p>
                      <p>🎵 Creating your therapeutic music...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 4:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl sm:text-4xl font-display font-thin mb-6 text-foreground tracking-tight">
                Your Therapeutic Music is Ready!
              </h2>
              <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                Based on your assessment, we've created a unique musical experience designed to support your mental wellness journey.
              </p>
            </div>

            {generatedTrackUrl && (
              <div className="max-w-3xl mx-auto space-y-8 mb-12">
                <MusicVisualizer3D />
                <AudioPlayer audioUrl={generatedTrackUrl} />

                <Card>
                  <CardContent className="p-8">
                    <label className="block text-lg font-display font-light mb-4 text-foreground">
                      How did this music make you feel?
                    </label>
                    <p className="text-sm text-muted-foreground font-light mb-4">
                      Did it help you relax? Match your emotional state? What would you change?
                    </p>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your thoughts and impressions..."
                      className="min-h-32 resize-none font-light"
                    />
                    <Button
                      onClick={handleSubmitFeedback}
                      className="mt-4 bg-gradient-primary hover:opacity-90"
                    >
                      Submit Feedback
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <Home className="h-5 w-5" />
                Back to Home
              </Button>
              <Button
                size="lg"
                onClick={handleReset}
                className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="h-5 w-5" />
                Generate Different Music
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 font-inter relative">
      <FloatingParticles />
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-thin mb-2 bg-gradient-primary bg-clip-text text-transparent tracking-tight">
            Mental Wellness Assessment
          </h1>
          <p className="text-muted-foreground font-light">
            Answer a few questions to receive your personalized AI-generated music therapy
          </p>
        </div>

        {/* Progress */}
        <ProgressIndicator currentStep={currentStep} totalSteps={4} />

        {/* Step Content */}
        <div className="mt-12">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
