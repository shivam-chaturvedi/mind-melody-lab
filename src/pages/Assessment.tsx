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

const issues = [
  { id: 'anxiety' as Issue, emoji: '😟', title: 'Anxiety' },
  { id: 'depression' as Issue, emoji: '😔', title: 'Depression' },
  { id: 'relationship' as Issue, emoji: '💞', title: 'Relationship' },
  { id: 'stress' as Issue, emoji: '😩', title: 'Stress' },
  { id: 'sleep' as Issue, emoji: '😴', title: 'Sleep Issues' },
];

const instruments = [
  { id: 'piano' as Instrument, emoji: '🎹', name: 'Piano' },
  { id: 'guitar' as Instrument, emoji: '🎸', name: 'Guitar' },
  { id: 'violin' as Instrument, emoji: '🎻', name: 'Violin' },
  { id: 'flute' as Instrument, emoji: '🎶', name: 'Flute' },
  { id: 'synth' as Instrument, emoji: '🎧', name: 'Synth' },
];

const intensityLabels: Record<Issue, string[]> = {
  anxiety: ['Tension', 'Worry', 'Restlessness', 'Physical Symptoms', 'Sleep Impact'],
  depression: ['Low Mood', 'Energy Loss', 'Interest Loss', 'Hopelessness', 'Sleep Issues'],
  relationship: ['Communication', 'Trust', 'Conflict', 'Intimacy', 'Satisfaction'],
  stress: ['Overwhelm', 'Tension', 'Irritability', 'Focus', 'Physical Impact'],
  sleep: ['Difficulty Falling Asleep', 'Staying Asleep', 'Early Waking', 'Fatigue', 'Mood Impact'],
};

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
    setGenerationStatus('Initializing...');
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
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C4DFF', '#FF4081'],
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                What brings you here today?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select the area where you'd like support. Our AI will tailor the music to your specific needs.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
              {issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  emoji={issue.emoji}
                  title={issue.title}
                  isSelected={selectedIssue === issue.id}
                  onClick={() => setSelectedIssue(issue.id)}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={nextStep}
                disabled={!selectedIssue}
                className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Next: Assess Intensity
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        );

      case 2:
        const labels = selectedIssue ? intensityLabels[selectedIssue] : [];
        const scoreKeys = Object.keys(intensityScores) as Array<keyof typeof intensityScores>;
        
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                How intense are these feelings?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Rate each aspect from 0 (very low) to 4 (very high). This helps us create music that resonates with your current state.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto mb-12">
              <CardContent className="p-8 space-y-8">
                {scoreKeys.map((key, index) => (
                  <IntensitySlider
                    key={key}
                    label={labels[index] || key.charAt(0).toUpperCase() + key.slice(1)}
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
                Next: Choose Sound
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                Select your preferred sound
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the instrument and tempo that feels right for you.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-12 mb-12">
              {/* Instruments */}
              <div>
                <h3 className="text-xl font-semibold mb-6 text-foreground">Instrument</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {instruments.map((instrument) => (
                    <InstrumentCard
                      key={instrument.id}
                      emoji={instrument.emoji}
                      name={instrument.name}
                      isSelected={selectedInstrument === instrument.id}
                      onClick={() => setSelectedInstrument(instrument.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Tempo */}
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-foreground">Tempo</h3>
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
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Slow & Calm (60)</span>
                      <span>Energetic (180)</span>
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
                  <p className="text-lg font-medium text-foreground mb-2">{generationStatus}</p>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all duration-500"
                      style={{ width: `${generationProgress}%` }}
                    />
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                Your Music is Ready!
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience your personalized therapeutic soundscape. Listen, relax, and let the music support your well-being.
              </p>
            </div>

            {generatedTrackUrl && (
              <div className="max-w-3xl mx-auto space-y-8 mb-12">
                <AudioPlayer audioUrl={generatedTrackUrl} />

                <Card>
                  <CardContent className="p-8">
                    <label className="block text-lg font-semibold mb-4 text-foreground">
                      How does this music make you feel?
                    </label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your thoughts and impressions..."
                      className="min-h-32 resize-none"
                    />
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
                Return Home
              </Button>
              <Button
                size="lg"
                onClick={handleReset}
                className="gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="h-5 w-5" />
                Generate New Music
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Melody Matrix
          </h1>
          <p className="text-muted-foreground">AI-Powered Music Therapy Assessment</p>
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
