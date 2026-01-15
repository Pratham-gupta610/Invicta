import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Users } from "lucide-react";

export default function Contact() {
  const contacts = [
    {
      name: "Shubh Tiwari",
      role: "Secretary, Sports Board",
      phone: "+91 95280 15193",
      icon: "👤"
    },
    {
      name: "Yash Pol",
      role: "Coordinator, Sports Board",
      phone: "+91 84520 20749",
      icon: "👤"
    },
    {
      name: "Mohammed Ataul",
      role: "Coordinator, Sports Board",
      phone: "+91 94704 37467",
      icon: "👤"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 xl:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl xl:text-6xl font-bold mb-6">
              Get in <span className="carnival-gradient-text">Touch</span>
            </h1>
            <p className="text-xl xl:text-2xl text-muted-foreground font-medium">
              We're here to help with your sports event inquiries
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-16 xl:py-20">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl xl:text-4xl font-bold">Sports Board Team</h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Reach out to our dedicated team members for any questions, support, 
                or information about sports events at IIIT Guwahati.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-16">
              {contacts.map((contact, index) => (
                <Card 
                  key={index}
                  className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
                >
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 text-5xl">{contact.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{contact.role}</p>
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Phone className="h-4 w-4" />
                      <a 
                        href={`tel:${contact.phone}`}
                        className="font-semibold hover:text-secondary transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Contact Information */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="border-secondary/20">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10 shrink-0">
                      <MapPin className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                      <p className="text-muted-foreground">
                        Sports Board Office<br />
                        Indian Institute of Information Technology<br />
                        Bongora, Guwahati<br />
                        Assam 781015, India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10 shrink-0">
                      <Mail className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Email Us</h3>
                      <p className="text-muted-foreground mb-3">
                        For general inquiries and event information
                      </p>
                      <a 
                        href="mailto:sports@iiitg.ac.in"
                        className="text-primary hover:text-secondary transition-colors font-semibold"
                      >
                        sports@iiitg.ac.in
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-16 xl:py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="border-accent/20 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8 xl:p-12 text-center">
                <h2 className="text-2xl xl:text-3xl font-bold mb-4">
                  Need Immediate Assistance?
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  For urgent matters or event-day support, please call our team directly. 
                  We're committed to ensuring your sports experience is smooth and enjoyable.
                </p>
                <div className="flex flex-col xl:flex-row gap-4 justify-center">
                  <a 
                    href="tel:+919528015193"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    Call Shubh Tiwari
                  </a>
                  <a 
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
                  >
                    Browse Events
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-16 xl:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl xl:text-3xl font-bold mb-6">Office Hours</h2>
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Weekdays</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday<br />
                      9:00 AM - 6:00 PM
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Weekends</h3>
                    <p className="text-muted-foreground">
                      Saturday - Sunday<br />
                      10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    During major events and tournaments, extended hours may apply. 
                    Please call ahead to confirm availability.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
