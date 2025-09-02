import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  CheckCircle2,
  Shield,
  Clock,
  Users,
  Star,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
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

  // countdown per visitor
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

  // load LaunchPass script when needed
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
// --- Live "Recent Plays" ticker config ---
const ROTATE_MS = 5000;

type RecentPlay = {
  headline: string;
  details: string;
};

const recentPlays: RecentPlay[] = useMemo(
  () => [
    {
      headline: "ETH scalp +$842",
      details: "Posted entry, stop, TP before the move. (9:42 AM ET)",
    },
    {
      headline: "BTC range break +2.1R",
      details: "Clean breakout + retest, called in Premium with risk mapped.",
    },
    {
      headline: "SOL momentum +$316",
      details: "Momentum continuation during NY open; partials taken live.",
    },
    {
      headline: "OP fade +1.6R",
      details: "Mean reversion after sweep; shared invalidation upfront.",
    },
  ],
  []
);

const [playIdx, setPlayIdx] = useState(0);
const [paused, setPaused] = useState(false);

useEffect(() => {
  if (recentPlays.length <= 1) return;
  const id = setInterval(() => {
    if (!paused) setPlayIdx((i) => (i + 1) % recentPlays.length);
  }, ROTATE_MS);
  return () => clearInterval(id);
}, [recentPlays.length, paused]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full" style={{ background: "#6C2BD9" }} />
            <span className="text-sm font-semibold tracking-wide">No Limit Trades</span>
          </div>
          <div className="flex items-center gap-3 text-xs md:text-sm">
            <Clock className="h-4 w-4" />
            <span className="uppercase tracking-wide text-white/70">Offer ends in</span>
            <span className="font-mono tabular-nums">
              {String(remaining.hours).padStart(2, "0")}:
              {String(remaining.minutes).padStart(2, "0")}:
              {String(remaining.seconds).padStart(2, "0")}
            </span>
            <Button onClick={() => setShowCheckout(true)} className="ml-2 rounded-2xl px-4 py-2 text-black">
              Get Access for $29
            </Button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
  {/* make the overlay ignore clicks and sit behind */}
  <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(108,43,217,0.35),transparent_60%)]" />
  {/* make sure the real content is above */}
  <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
    {/* ... */}
          <div className="flex flex-col justify-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Turn Volatile Markets Into <span className="text-[#9B8AFB]">Predictable Profits</span>
            </motion.h1>
            <p className="mt-4 max-w-xl text-white/80">
              Watch this short video to see how I find my setups daily — and how you can start trading alongside me inside the private room.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => setShowVideo(true)} className="rounded-2xl px-5 py-6 text-base font-semibold text-white">
                <Play className="mr-2 h-5 w-5" /> Watch 3-min VSL
              </Button>
              <Button onClick={() => setShowCheckout(true)} variant="secondary"
                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-6 text-base font-semibold text-white">
                Get Access for $29 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> 7-Day Refund • Cancel Anytime</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4" /> 300+ Members Inside</div>
            </div>
          </div>

          {/* Proof cards */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-b from-[#6C2BD9]/10 to-transparent blur-2xl" />
            <div className="grid gap-4">
              <Card className="rounded-2xl border-white/10 bg-white/5">
                <CardHeader><CardTitle className="text-sm text-white/70">Recent Win</CardTitle></CardHeader>
                <CardContent className="text-white/90">ETH scalp +$842 — posted before the move.</CardContent>
              </Card>
              <Card className="rounded-2xl border-white/10 bg-white/5">
                <CardHeader><CardTitle className="text-sm text-white/70">Member Shoutout</CardTitle></CardHeader>
                <CardContent className="text-white/90">“Clear plan, defined risk. I finally stopped overtrading.” — J.R.</CardContent>
              </Card>
              <Card className="rounded-2xl border-white/10 bg-white/5">
                <CardHeader><CardTitle className="text-sm text-white/70">Receipts</CardTitle></CardHeader>
                <CardContent className="text-white/90">Daily receipts: entries, risk, exits. No hype — just process.</CardContent>
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
      {/* Offer + Testimonials */}
      <section className="relative overflow-hidden border-y border-white/10 bg-gradient-to-b from-[#6C2BD9]/10 to-transparent">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-extrabold sm:text-3xl">
              Get Full Access Today for <span className="text-[#9B8AFB]">$29</span>
            </h3>
            <p className="mt-3 max-w-xl text-white/80">
              Price never changes. Try it risk-free for 7 days. Cancel anytime.
            </p>
            <ul className="mt-6 space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5" style={{ color: "#9B8AFB" }} />
                Daily setups + live breakdowns
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5" style={{ color: "#9B8AFB" }} />
                Beginner’s Crash Course ($199 value)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5" style={{ color: "#9B8AFB" }} />
                Trade Tracker Template ($49 value)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5" style={{ color: "#9B8AFB" }} />
                Private community + signals
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setShowCheckout(true)} className="rounded-2xl px-6 py-7 text-base font-semibold text-white">
                Get Access for $29
              </Button>
              <Button
                onClick={() => setShowVideo(true)}
                variant="secondary"
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-7 text-base font-semibold text-white"
              >
                Watch the VSL
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-white/60">
              <Shield className="h-4 w-4" /> 100% Secure • Cancel Anytime • 7-Day Guarantee
            </div>
          </div>

          {/* Testimonials */}
          <Card className="rounded-2xl border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Member Wins & Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/85">
              <blockquote className="rounded-xl border border-white/10 bg-black/30 p-4">
                “I learned more in a week here than months on YouTube.” — A.M.
              </blockquote>
              <blockquote className="rounded-xl border border-white/10 bg-black/30 p-4">
                “Signals are clear, risk is mapped out. Took the stress out of my mornings.” — K.P.
              </blockquote>
              <blockquote className="rounded-xl border border-white/10 bg-black/30 p-4">
                “Made back my sub in one ETH move. Straight up worth it.” — J.R.
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h4 className="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h4>
        <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
          {[
            { q: "What exactly is inside Premium?", a: "Daily setups, live commentary, a beginner-friendly course, and a private community focused on execution." },
            { q: "Do you guarantee profits?", a: "No. Trading involves risk and losses can occur. We provide education, process, and live context — not financial advice." },
            { q: "Can I cancel anytime?", a: "Yes. It's month-to-month. Cancel in a click inside your account settings." },
            { q: "I'm brand new — is this for me?", a: "Yes. Start with the Crash Course and use the trade tracker to learn with structure. Ask questions in chat — we answer fast." },
          ].map((item) => (
            <details
              key={item.q}
              open={faqOpen === item.q}
              onToggle={(e) => setFaqOpen((e.target as HTMLDetailsElement).open ? item.q : null)}
              className="group"
            >
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-white/90 hover:bg-white/5">
                <span>{item.q}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 text-white/70">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* VSL Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute right-3 top-3 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/80 hover:bg-white/20"
            >
              Close
            </button>
            <div className="aspect-video w-full">
              {/* replace src with your real Vimeo/YouTube URL */}
              <iframe
                className="h-full w-full"
                src="https://player.vimeo.com/video/000000000?title=0&byline=0&portrait=0"
                title="No Limit Trades VSL"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-black">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute right-3 top-3 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/80 hover:bg-white/20"
            >
              Close
            </button>
            <div className="w-full">
              {CHECKOUT_EMBED_URL ? (
                <iframe
                  src={CHECKOUT_EMBED_URL}
                  className="h-[600px] w-full"
                  title="Checkout"
                  allow="payment; clipboard-write;"
                />
              ) : (
                <div className="p-4">
                  {/* LaunchPass buttons injected; script loads in useEffect */}
                  <div dangerouslySetInnerHTML={{ __html: CHECKOUT_EMBED_HTML }} />
                  {!lpLoaded && (
                    <div className="mt-4 text-center text-white/60 text-sm">
                      Loading secure checkout…
                    </div>
                  )}
          
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Checkout Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-3 md:flex-row">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <Clock className="h-4 w-4" />
            <span className="text-white/70">Offer expires in</span>
            <span className="font-mono tabular-nums">
              {String(remaining.hours).padStart(2, "0")}:
              {String(remaining.minutes).padStart(2, "0")}:
              {String(remaining.seconds).padStart(2, "0")}
            </span>
          </div>
          <Button onClick={() => setShowCheckout(true)} className="rounded-2xl px-5 py-6 text-white">
            Get Access for $29
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-white/10 py-10 text-center text-xs text-white/50">
        <p>© {new Date().getFullYear()} No Limit Trades. All rights reserved.</p>
        <p className="mt-2">
          For education only. Not financial advice. Trading futures/crypto carries risk. Past results do not
          guarantee future returns.
        </p>
      </footer>
    </div>
  );
}
