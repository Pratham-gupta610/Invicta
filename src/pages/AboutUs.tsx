import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Target, Heart, Zap, Award } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 xl:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl xl:text-6xl font-bold mb-6">
              Sports Club at <span className="carnival-gradient-text">IIIT Guwahati</span>
            </h1>
            <p className="text-xl xl:text-2xl text-muted-foreground font-medium">
              Empowering Excellence Through Sports
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 xl:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 xl:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl xl:text-4xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The Sports Board at IIIT Guwahati stands as a cornerstone of campus life, 
                  dedicated to fostering a dynamic and inclusive sports culture. We believe 
                  that sports are not just about competition—they're about building character, 
                  forging friendships, and creating unforgettable memories. Through our 
                  comprehensive programs and events, we strive to make sports accessible, 
                  enjoyable, and transformative for every member of our community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 xl:py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Zap className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold">What We Do</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Throughout the year, the Sports Board actively organizes, manages, and 
              promotes a diverse range of sporting events that bring our campus community 
              together:
            </p>
            
            <div className="grid gap-6">
              <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-secondary">
                    🏆 Inter-Hostel Competitions
                  </h3>
                  <p className="text-muted-foreground">
                    Fierce rivalries and team spirit come alive as hostels compete for glory 
                    across multiple sports. These events foster camaraderie and healthy 
                    competition among residents.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-secondary">
                    🎯 Inter-Departmental Tournaments
                  </h3>
                  <p className="text-muted-foreground">
                    Departments showcase their athletic prowess in friendly yet competitive 
                    matches. These tournaments strengthen bonds between academic divisions 
                    and celebrate departmental pride.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-secondary">
                    ⚡ Institute-Level Championships
                  </h3>
                  <p className="text-muted-foreground">
                    Premier events that celebrate the best athletes and teams on campus. 
                    These championships represent the pinnacle of competitive sports at 
                    IIIT Guwahati.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-secondary">
                    🎪 Recreational Activities
                  </h3>
                  <p className="text-muted-foreground">
                    Regular sports sessions and fitness programs for all skill levels. 
                    We ensure everyone can participate, learn, and enjoy sports regardless 
                    of their experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 xl:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 rounded-lg bg-accent/10">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold">Our Values</h2>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="border-accent/20 hover:border-accent/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-bold">Teamwork</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We foster collaboration and unity, teaching students to work together 
                    towards common goals both on and off the field.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 hover:border-accent/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-bold">Discipline</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Through sports, we instill dedication, commitment, and the importance 
                    of consistent effort in achieving excellence.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 hover:border-accent/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-bold">Leadership</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We develop future leaders by providing opportunities to take initiative, 
                    make decisions, and inspire others.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 hover:border-accent/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-bold">Fitness</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We promote physical well-being and healthy lifestyles, recognizing that 
                    a fit body supports a sharp mind.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 hover:border-accent/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-bold">Inclusivity</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Sports are for everyone. We create welcoming environments where all 
                    students can participate and thrive.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 hover:border-accent/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Trophy className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-bold">Sportsmanship</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We emphasize fair play, respect for opponents, and grace in both 
                    victory and defeat.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 xl:py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8 xl:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl xl:text-4xl font-bold">Our Team</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  The Sports Board is led by <span className="font-semibold text-foreground">Secretary Shubh Tiwari</span>, 
                  whose vision and dedication drive our mission forward. Supporting him are 
                  <span className="font-semibold text-foreground"> 10 dedicated coordinators</span>, each bringing 
                  unique expertise and passion to their roles.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Together, this dynamic team works collaboratively to build a vibrant and 
                  competitive sports culture at IIIT Guwahati. From planning major tournaments 
                  to organizing daily activities, they ensure that sports remain an integral 
                  and exciting part of campus life. Their commitment to excellence, innovation, 
                  and student welfare makes them the backbone of our thriving sports community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 xl:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl xl:text-4xl font-bold mb-6">
              Join the <span className="carnival-gradient-text">Movement</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're a seasoned athlete or just starting your sports journey, 
              the Sports Board welcomes you. Together, let's build a stronger, healthier, 
              and more united IIIT Guwahati community through the power of sports.
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center">
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Explore Events
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
