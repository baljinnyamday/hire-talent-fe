"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    title: "AI-Powered Matching",
    description: "Advanced algorithms analyze candidates and job requirements to find perfect matches",
    icon: "🤖",
  },
  {
    title: "Smart Evaluation",
    description: "Automated skill assessments and behavioral analysis for comprehensive candidate insights",
    icon: "⚡",
  },
  {
    title: "Real-Time Analytics",
    description: "Track hiring metrics, pipeline status, and team performance in real-time dashboards",
    icon: "📊",
  },
  {
    title: "Automated Workflows",
    description: "Streamline screening, interviews, and onboarding with intelligent automation",
    icon: "🔄",
  },
  {
    title: "Talent Pool Management",
    description: "Build and maintain a curated database of qualified candidates for future roles",
    icon: "👥",
  },
  {
    title: "Bias Reduction",
    description: "AI ensures fair, objective evaluations by focusing on skills and qualifications",
    icon: "⚖️",
  },
];

export function Features() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">
          Powered by <i className="font-light">intelligence</i>
        </h2>
        <p className="font-mono text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto">
          Our agentic AI platform transforms how you discover, evaluate, and hire exceptional talent
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="bg-card/50 backdrop-blur-sm border-border hover:border-foreground/20 transition-colors"
          >
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
