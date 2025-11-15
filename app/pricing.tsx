"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ButtonSecondary as Button } from "@/components/ui/button_secondary";
import { Pill } from "@/components/pill";

const plans = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "Perfect for small teams and startups",
    features: [
      "Up to 10 active job postings",
      "AI-powered candidate matching",
      "Basic analytics dashboard",
      "Email support",
      "100 candidate evaluations/month",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$1,299",
    period: "/month",
    description: "For growing companies with regular hiring needs",
    features: [
      "Unlimited job postings",
      "Advanced AI matching & insights",
      "Real-time analytics & reporting",
      "Priority support",
      "500 candidate evaluations/month",
      "Custom workflow automation",
      "Talent pool management",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations",
    features: [
      "Everything in Professional",
      "Unlimited candidate evaluations",
      "Dedicated account manager",
      "Custom AI training",
      "API access & integrations",
      "Advanced security & compliance",
      "SLA guarantees",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">
            Simple, <i className="font-light">transparent</i> pricing
          </h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto">
            Choose the plan that fits your hiring needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative bg-card/50 backdrop-blur-sm border-border flex flex-col ${
                plan.popular ? "border-primary shadow-lg shadow-primary/10 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Pill>MOST POPULAR</Pill>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="font-mono text-sm mb-6">{plan.description}</CardDescription>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-sentient">{plan.price}</span>
                  {plan.period && <span className="text-foreground/60 font-mono text-sm">{plan.period}</span>}
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">✓</span>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6">
                <Button className="w-full">[{plan.cta}]</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-mono text-sm text-foreground/60">
            All plans include SSL security, data encryption, and GDPR compliance
          </p>
        </div>
      </div>
    </section>
  );
}
