import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Play, Sparkles, Activity } from "lucide-react";

import { HeroCardStack } from "@/components/hero-card-stack";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[600px] w-[600px] rounded-full bg-accent/40 blur-3xl" />

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <Activity className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            sofia<span className="font-normal text-primary">pulse</span>
          </span>
        </a>
        <div className="hidden items-center gap-10 text-sm font-medium text-foreground/80 md:flex">
          <a href="#" className="story-link">Book a demo</a>
          <a href="#" className="story-link">Pagers</a>
          <a href="#" className="story-link">Request a mockup</a>
          <button className="flex items-center gap-1 story-link">
            EN <ChevronDown className="h-3 w-3" />
          </button>
        </div>
        <button className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105">
          Get Started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <div className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Creative Platform
          </div>
          <h1 className="font-extrabold leading-[1.05] tracking-[-0.035em] text-foreground text-4xl sm:text-5xl lg:text-[4.25rem] whitespace-nowrap-none">
            <span className="whitespace-nowrap">Better Creative</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              that gets Smarter.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Generate dynamic ads in minutes. Adapt by audience, moment, channel,
            and performance.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105">
              Create smarter ads
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button className="group inline-flex items-center gap-3 text-sm font-semibold text-foreground">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 transition-colors group-hover:bg-primary/10">
                <Play className="h-3.5 w-3.5 fill-primary text-primary" />
              </span>
              See how it works
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          className="relative flex items-center justify-center"
        >
          <HeroCardStack />
        </motion.div>
      </section>
    </div>
  );
}
