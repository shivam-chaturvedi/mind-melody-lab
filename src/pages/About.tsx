import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Mail, Phone, MapPin, Heart, Brain, Music } from 'lucide-react';
import { FloatingParticles } from '@/components/FloatingParticles';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-inter relative">
      <FloatingParticles />
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container max-w-6xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-thin mb-6 text-foreground tracking-tight">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">Melody Matrix</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-3xl mx-auto">
            Combining the healing power of music with cutting-edge AI to support your mental wellness journey
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-display font-light mb-6 text-foreground tracking-tight">Our Mission</h2>
          </div>
          
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardContent className="p-6 sm:p-10">
              <p className="text-lg leading-relaxed text-muted-foreground font-light mb-6">
                Melody Matrix was created from a passion for both music and mental health awareness. 
                Our mission is to provide accessible, personalized music therapy experiences to help 
                individuals manage stress, anxiety, and emotional well-being through the power of 
                AI-generated music.
              </p>
              <blockquote className="border-l-4 border-primary pl-6 italic text-xl text-foreground font-light">
                "Music can heal the wounds which medicine cannot touch."
                <footer className="text-sm text-muted-foreground mt-2 font-light">— Debasish Mridha, MD</footer>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Science Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <Brain className="h-16 w-16 text-secondary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-display font-light mb-4 text-foreground tracking-tight">
              The Science Behind Music Therapy
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-3xl mx-auto">
              Music therapy is a well-established clinical intervention that uses music to address 
              physical, emotional, cognitive, and social needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 animate-fade-in-up">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 sm:p-8">
                <div className="text-4xl mb-4">🧘</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Reduce Stress & Anxiety</h3>
                <p className="text-muted-foreground">
                  Music lowers cortisol levels and activates the parasympathetic nervous system, 
                  promoting deep relaxation.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 sm:p-8">
                <div className="text-4xl mb-4">😊</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Improve Mood</h3>
                <p className="text-muted-foreground">
                  Listening to music increases dopamine and serotonin production, naturally elevating mood.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 sm:p-8">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Enhance Focus</h3>
                <p className="text-muted-foreground">
                  Specific rhythms and tempos can improve concentration and cognitive performance.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 sm:p-8">
                <div className="text-4xl mb-4">😴</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Better Sleep</h3>
                <p className="text-muted-foreground">
                  Calming music helps regulate circadian rhythms and promotes deeper, more restorative sleep.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <Music className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-display font-light mb-4 text-foreground tracking-tight">
              How Our AI Music Generation Works
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-3xl mx-auto">
              Our platform uses advanced AI models trained on millions of musical compositions to create 
              unique soundscapes tailored to your emotional state.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 animate-fade-in-up">
            {[
              {
                step: '1',
                title: 'Assessment',
                description: 'Understanding your current emotional state through our questionnaire',
              },
              {
                step: '2',
                title: 'Analysis',
                description: 'Processing your responses to determine the most beneficial musical elements',
              },
              {
                step: '3',
                title: 'Generation',
                description: 'Creating a unique musical composition optimized for your needs',
              },
              {
                step: '4',
                title: 'Delivery',
                description: 'Providing you with a personalized audio experience you can listen to anytime',
              },
            ].map((item) => (
              <Card key={item.step} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-display font-light mb-4 text-foreground tracking-tight">Our Team</h2>
            <p className="text-lg text-muted-foreground font-light max-w-3xl mx-auto">
              Founded by a team of music therapists, AI researchers, and mental health professionals 
              dedicated to making therapeutic music accessible to everyone.
            </p>
          </div>

          <div className="flex justify-center animate-fade-in-up">
            <Card className="max-w-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center text-6xl">
                  👩‍💼
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Ahana Gandhi</h3>
                <p className="text-primary font-semibold mb-4">Founder & CEO</p>
                <p className="text-muted-foreground">
                  Passionate about combining technology with wellness to create meaningful impact in mental health.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-light mb-4 text-foreground tracking-tight">Contact Us</h2>
            <p className="text-lg text-muted-foreground font-light">
              We'd love to hear from you! Whether you have questions, feedback, or ideas for improvement.
            </p>
          </div>

          <Card className="border-2 border-primary/20 shadow-xl">
            <CardContent className="p-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <a href="mailto:support@melodymatrix.com" className="text-primary hover:underline">
                      support@melodymatrix.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <a href="tel:+15551234567" className="text-primary hover:underline">
                      (555) 123-4567
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-muted-foreground">123 Wellness Way, San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto">
          <Card className="bg-gradient-primary text-primary-foreground shadow-2xl animate-scale-in">
            <CardContent className="p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Experience the Difference?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Start your journey to better mental wellness with personalized AI-generated music.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/assessment')}
                className="w-full sm:w-auto gap-2 px-8 py-6 text-lg bg-background text-foreground hover:bg-background/90"
              >
                Begin Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Melody Matrix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
