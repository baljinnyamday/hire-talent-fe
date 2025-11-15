"use client";

import { Hero } from "@/app/hero";
import { Features } from "@/app/features";
import { Testimonials } from "@/app/testimonials";
import { Pricing } from "@/app/pricing";
import { Contact } from "@/app/contact";
import { Footer } from "@/app/footer";
import { Header } from "@/components/header";
import { Leva } from "leva";
import "./new_globals.css";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <Contact />
      <Footer />
      <Leva hidden />
    </>
  );
}
