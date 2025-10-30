import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/FeatureCard';
import { Music, ArrowRight, Sparkles } from 'lucide-react';
import { Scene3D } from '@/components/Scene3D';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <Scene3D />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-card border border-border shadow-md">
              <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
              <span className="text-sm font-light tracking-wide bg-gradient-primary bg-clip-text text-transparent">
                AI-Powered Music Therapy
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-thin mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                Melody Matrix
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground font-light mb-8 max-w-3xl mx-auto leading-relaxed tracking-wide">
              Experience personalized AI-generated music to support your emotional well-being. 
              Reduce stress, improve mood, and enhance focus through scientifically designed soundscapes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={() => navigate('/assessment')}
                className="gap-2 px-8 py-6 text-lg bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg"
              >
                Start Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/about')}
                className="gap-2 px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-display font-light mb-4 text-foreground tracking-tight">
              How Melody Matrix Can Help You
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              Our AI analyzes your needs and creates unique musical experiences tailored to your emotional state
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up">
            <FeatureCard
              icon="🧠"
              title="Personalized Assessment"
              description="Our AI analyzes your mental wellness needs through a simple questionnaire to create music tailored to your emotional state."
            />
            <FeatureCard
              icon="🎵"
              title="AI-Generated Music"
              description="Experience unique soundscapes created specifically for your emotional needs, using advanced AI music generation technology."
            />
            <FeatureCard
              icon="💆"
              title="Therapeutic Benefits"
              description="Reduce stress, improve mood, enhance focus, and promote relaxation through scientifically designed musical experiences."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-gradient-primary rounded-3xl p-12 text-center text-primary-foreground shadow-2xl animate-scale-in">
            <Music className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get Started with Melody Matrix
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Begin your musical journey to better mental wellness. Take our assessment and receive personalized AI-generated music.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/assessment')}
                className="gap-2 px-8 py-6 text-lg bg-background text-foreground hover:bg-background/90"
              >
                Begin Your Musical Journey
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/about')}
                className="gap-2 px-8 py-6 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Discover the Science
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
