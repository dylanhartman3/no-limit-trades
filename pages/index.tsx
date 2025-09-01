import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle2, Shield, Clock, Users, Star, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

// Optional backup checkout URL (used only if embed fails)
const CHECKOUT_URL = "https://example.com/checkout";

// Countdown length in minutes
const COUNTDOWN_MINUTES = 15;

// Optional: direct iframe URL for checkout if your processor supports it
const CHECKOUT_EMBED_URL = "";

// LaunchPass embed snippet
const CHECKOUT_EMBED_HTML = `
  <button target="_blank"
    style="font-family: sans-serif; margin: 0 auto; outline: none; display: block; height: 45px; width: 226px; border-radius: 6px; background: rgba(0, 0, 0, 0.631373); color: white; box-shadow: 1px 1px 3px 0 rgba(0,0,0,.03); font-size: 18px; font-weight: 700; border: none; cursor: pointer;"
    class="lp6484943331524608 lpbtn" yearly="true">Join Yearly Access</button>
  <br/>
  <button target="_blank"
    style="font-family: sans-serif; margin: 0 auto; outline: none; display: block; height: 45px; width: 226px; border-radius: 6px; background: rgba(0, 0, 0, 0.631373); color: white; box-shadow: 1px 1px 3px 0 rgba(0,0,0,.03); font-size: 18px; font-weight: 700; border: none; cursor: pointer;"
    class="lp6484943331524608 lpbtn" monthly="true">Join Monthly Access</button>
`;

export default function NoLimitTradesVSL() {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [faqOpen, setFaqOpen] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [lpLoaded, setLpLoaded] = useState(false);

  // per-visitor rolling countdown
  useEffect(() => {
    const key = "nlt_vsl_deadline";
    const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    let end = saved ? parseInt(saved) : NaN;
    if (!saved || Number.isNaN(end) || end < Date.now()) {
      end = Date.now() + COUNTDOWN_MINUTES * 60 * 1000;
      if (typeof window !== "undefined") localStorage.setItem(key, String(end));
    }
    setDeadline(end);
  }, []);

  useEffect(() => {
    if (!deadline) return;
    const int = setInterval(() => {
      const diff = Math.max(0, deadline - Date.now());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setRemaining({ hours, minutes, seconds });
    }, 250);
    return () => clearInterval(int);
  }, [deadline]);

  // Dynamically load LaunchPass script when checkout opens
  useEffect(() => {
    if (!showCheckout) return;
    const id = "lp-embed-script";
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      setLpLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = "https://www.launchpass.com/nolimittrades/crypto/embed.js";
    s.onload = () => setLpLoaded(true);
    document.body.appendChild(s);
  }, [showCheckout]);

  const features = useMemo(
    () => [
      { title: "Daily Trade Setups", desc: "See exactly what I'm watching each morning and why.", icon: CheckCircle2 },
      { title: "Live Market Breakdowns", desc: "Real-time commentary when volatility hits.", icon: Users },
      { title: "Beginner's Crash Course", desc: "Fast-start videos that cut through noise.", icon: Play },
      { title: "Trade Tracker Template", desc: "Google Sheet to systemize and scale your wins.", icon: Shield },
      { title: "Private Community", desc: "Surround yourself with focused traders only.", icon: Star },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full" style={{ background: "#6C2BD9" }} />
            <span className="text-sm font-semibold tracking-wide">No Limit Trades</span>
          </div>
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <Clock className="h-4 w-4" />
            <span className="uppercase tracking-wide text-white/70">Offer ends in</span>
            <span className="font-mono tabular-nums">{String(remaining.hours).padStart(2, "0")}:{String(remaining.minutes).padStart(2, "0")}:{String(remaining.seconds).padStart(2, "0")}</span>
            <Button onClick={() => setShowCheckout(true)} className="ml-2 rounded-2xl px-4 py-2 text-black">
              Get Access for $29
            </Button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(108,43,217,0.35),transparent_60%)]" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl"
            >
              Turn Volatile Markets Into <span className="text-[#9B8AFB]">Predictable Profits</span>
            </motion.h1>
            <p className="mt-4 max-w-xl text-white/80">
              Watch this short video to see how I find my setups daily — and how you can start trading alongside me inside the private room.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => setShowVideo(true)} className="rounded-2xl px-5 py-6 text-base font-semibold text-white">
                <Play className="mr-2 h-5 w-5" /> Watch 3-min VSL
              </Button>
              <Button onClick={() => setShowCheckout(true)} variant="secondary" className="rounded-2xl border border-white/20 bg-white/10 px-5 py-6 text-base font-semibold text-white">
                Get Access for $29 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> 7-Day Refund • Cancel Anytime</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4" /> 300+ Members Inside</div>
            </div>
          </div>

          {/* Proof card stack */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-b from-[#6C2BD9]/10 to-transparent blur-2xl" />
            <div className="grid gap-4">
              <Card className="rounded-2xl border-white/10 bg-white/5">
                <CardHeader><CardTitle className="text-sm text-white/70">Recent Win</CardTitle></CardHeader>
                <CardContent className="text-white/90">
                  ETH scalp +$842 — posted with entry, stop, and TP *before* the move. (Time-stamped in Premium)
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-white/10 bg-white/5">
                <CardHeader><CardTitle className="text-sm text-white/70">Member Shoutout</CardTitle></CardHeader>
                <CardContent className="text-white/90">
                  “Clear plan, defined risk. I finally stopped overtrading.” — J.R.
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-white/10 bg-white/5">
                <CardHeader><CardTitle className="text-sm text-white/70">Receipts</CardTitle></CardHeader>
                <CardContent className="text-white/90">
                  Daily receipts: entries, risk, and exits. No hype — just process and timing.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Value Stack */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">What You Get Inside <span className="text-[#9B8AFB]">Premium</span></h2>
          <p className="mt-2 text-white/70">A complete toolkit to shorten your learning curve and keep you disciplined.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card key={i} className="rounded-2xl border-white/10 bg-white/5">
              <CardHeader className="flex items-center gap-3">
                <f.icon className="h-6 w-6" style={{ color: "#9B8AFB" }} />
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/80">{f.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Offer + Member Testimonials */}
      <section className="relative overflow-hidden border-y border-white/10 bg-gradient-to-b from-[#6C2BD9]/10 to-transparent">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-extrabold sm:text-3xl">Get Full Access Today for <span className="text-[#9B8AFB]">$29</span></h3>
            <p className="mt-3 max-w-xl text-white/80">Then $89/mo after. Try it risk-free for 7 days. If it’s not for you, get a full refund — no hassle. (No profits guaranteed.)</p>
            <ul className="mt-6 space-y-2 text-white/80">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5" style={{ color: "#9B8AFB" }} /> Daily setups + live breakdowns</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5" style={{ color: "#9B8AFB" }} /> Beginner’s Crash Course ($199 value)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5" style={{ color: "#9B8AFB" }} /> Trade Tracker Template ($49 value)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5" style={{ color: "#9B8AFB" }} /> Private community + signals</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setShowCheckout(true)} className="rounded-2xl px-6 py-7 text-base font-semibold text-white">
                Get Access for $29
              </Button>
              <Button onClick={() => setShowVideo(true)} variant="secondary" className="rounded-2xl border border-white/20 bg-white/10 px-6 py-7 text-base font-semibold text-white">
                Watch the VSL
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-white/60">
              <Shield className="h-4 w-4" /> 100% Secure • Cancel Anytime • 7-Day Guarantee
            </div>
          </div>

          {/* Testimonials Card */}
          <Card className="rounded-2xl border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Member Wins & Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/85">
              <blockquote className="rounded-xl border border-white/10 bg-black/30 p-4">“I learned more in a week here than months on YouTube.” — A.M.</blockquote>
              <blockquote className="rounded-xl border border-white/10 bg-black/30 p-4">“Signals are clear, risk is mapped out. Took the stress out of my mornings.” —
