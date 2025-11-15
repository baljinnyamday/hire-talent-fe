"use client";

import { useState } from "react";
import { ButtonSecondary as Button } from "@/components/ui/button_secondary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sentient mb-6">
            Let's <i className="font-light">talk</i>
          </h2>
          <p className="font-mono text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto">
            Ready to transform your hiring process? Get in touch with our team to learn more or schedule a demo.
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Started Today</CardTitle>
            <CardDescription className="font-mono">
              Fill out the form below and we'll get back to you within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium font-mono">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium font-mono">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium font-mono">
                  Company
                </label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your Company Inc."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium font-mono">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your hiring needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                [Send Message]
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="font-mono text-sm text-foreground/60 mb-4">
            Or reach us directly at
          </p>
          <a
            href="mailto:hello@hiretalent.ai"
            className="text-primary font-mono hover:underline"
          >
            hello@hiretalent.ai
          </a>
        </div>
      </div>
    </section>
  );
}
