"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "This platform reduced our time-to-hire by 60%. The AI matching is incredibly accurate and saves our team countless hours of manual screening.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechCorp",
    initials: "SC",
  },
  {
    quote:
      "We've hired 15 exceptional engineers in the last 6 months. The quality of candidates and the efficiency of the process is unmatched.",
    author: "Michael Rodriguez",
    role: "Head of Talent",
    company: "InnovateLabs",
    initials: "MR",
  },
  {
    quote:
      "The bias reduction feature gives us confidence that we're evaluating candidates fairly. It's transformed our hiring culture.",
    author: "Emma Thompson",
    role: "Chief People Officer",
    company: "GrowthTech",
    initials: "ET",
  },
  {
    quote:
      "As a startup, we needed to scale quickly. This platform helped us build our entire engineering team in record time with top-tier talent.",
    author: "David Park",
    role: "Co-founder & CTO",
    company: "StartupX",
    initials: "DP",
  },
  {
    quote:
      "The analytics dashboard provides insights we never had before. We can now optimize our hiring process based on real data.",
    author: "Jessica Williams",
    role: "Talent Acquisition Lead",
    company: "DataDriven Inc",
    initials: "JW",
  },
  {
    quote:
      "The automated workflows freed up our HR team to focus on candidate experience rather than administrative tasks. Game changer.",
    author: "Alex Kumar",
    role: "Director of HR",
    company: "FutureSoft",
    initials: "AK",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">
            Trusted by <i className="font-light">innovators</i>
          </h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto">
            Companies of all sizes are transforming their hiring with our AI platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-mono">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground font-mono">{testimonial.role}</div>
                    <div className="text-sm text-muted-foreground/60 font-mono">{testimonial.company}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 italic leading-relaxed">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
