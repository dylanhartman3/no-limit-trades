import React, { useEffect, useMemo, useState } from "react";

// ================== CONFIG ==================
const COUNTDOWN_MINUTES = 15;

// LaunchPass embed buttons (Yearly + Monthly)
const CHECKOUT_EMBED_HTML = `
  <button target="_blank"
    style="font-family: sans-serif; margin: 0 auto; outline: none; display: block; height: 45px; width: 226px; border-radius: 6px; background: rgba(0, 0, 0, 0.631373); color: white; box-shadow: 1px 1px 3px 0 rgba(0,0,0,.03); font-size: 18px; font-weight: 700; border: none; cursor: pointer;"
    class="lp6484943331524608 lpbtn" yearly="true">Join Yearly Access</button>
  <br/>
  <button target="_blank"
    style="font-family: sans-serif; margin: 0 auto; outline: none; display: block; height: 45px; width: 226px; border-radius: 6px; background: rgba(0, 0, 0, 0.631373); color: white; box-shadow: 1px 1px 3px 0 rgba(0,0,0,.03); font-size: 18px; font-weight: 700; border: none; cursor: pointer;"
    class="lp6484943331524608 lpbtn" monthly="true">Join Monthly Access</button>
`;

export default function IndexPage() {
  // --- countdown ---
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState({ h: 0, m: 0, s: 0 });

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
    const t = setInterval(() => {
      const diff = Math.max(0, deadline - Date.now());
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setRemaining({ h, m, s });
    }, 250);
    return () => clearInterval(t);
  }, [deadline]);

  // --- modals / embed loader ---
  const [showVideo, setShowVideo] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [lpLoaded, setLpLoaded] = useState(false);

  useEffect(() => {
    if (!showCheckout) return;
    const id = "lp-embed-script";
    if (document.getElementById(id)) {
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

  // --- hero features ---
  const features = useMemo(
    () => [
      { t: "Daily Trade Setups", d: "Exactly what I'm watching each morning and why." },
      { t: "Live Market Breakdowns", d: "Real-time commentary when volatility hits." },
      { t: "Beginner's Crash Course", d: "Fast-start videos that cut through noise." },
      { t: "Trade Tracker Template", d: "Google Sheet to systemize and scale your wins." },
      { t: "Private Community", d: "Focused traders only. No noise." },
    ],
    []
  );

  // --- rotating 'Recent Plays' ---
  const ROTATE_MS = 10000;
  type Play = { h: string; d: string };
  const recentPlays = useMemo<Play[]>(
    () => [
      { h: "ETH scalp +$842", d: "Entry/stop/TP posted before move (9:42 AM ET)." },
      { h: "BTC range break +2.1R", d: "Breakout → retest → continuation, risk mapped." },
      { h: "SOL momentum +$316", d: "NY open continuation, partials taken live." },
      { h: "OP fade +1.6R", d: "Mean reversion after sweep; invalidation clear." },
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

  // --- live member counter (simulated) ---
  const BASE_MEMBERS = 312;
  const MEMBER_FLUX = 28;
  const MEMBER_TICK_MS = 7000;
  const [onlineNow, setOnlineNow] = useState(BASE_MEMBERS);
  useEffect(() => {
    const rand = () => {
      const delta = Math.floor((Math.random() - 0.5) * 2 * MEMBER_FLUX);
      return Math.max(80, BASE_MEMBERS + delta);
    };
    setOnlineNow(rand());
    const id = setInterval(() => setOnlineNow(rand()), MEMBER_TICK_MS);
    return () => clearInterval(id);
  }, []);

  // --- wall of wins data ---
  type WinItem = { name: string; text: string };
  const wallOfWins: WinItem[] = useMemo(
    () => [
      { name: "Mark T.", text: "banked +$540 on ETH scalp" },
      { name: "Lisa K.", text: "closed SOL breakout +2.1R" },
      { name: "Andre P.", text: "BTC range fade +1.8R, clean execution" },
      { name: "Neha S.", text: "OP momentum +$310 before NYC lunch" },
      { name: "Jake R.", text: "sat out chop — W (discipline!)" },
      { name: "Ana G.", text: "ETH retest long +$420, textbook" },
    ],
    []
  );

  // --- value stack + comparison data ---
  type Val = { label: string; price: number };
  const valueStack: Val[] = [
    { label: "Daily Trade Setups", price: 297 },
    { label: "Live Market Breakdowns", price: 497 },
    { label: "Beginner’s Crash Course", price: 199 },
    { label: "Trade Tracker Template", price: 49 },
    { label: "Private Community", price: 99 },
  ];
  const valueTotal = valueStack.reduce((sum, v) => sum + v.price, 0);

  const freeVsPremium = [
    { label: "Structured daily plan", free: false, pro: true },
    { label: "Real-time context on volatility", free: false, pro: true },
    { label: "Beginner crash course", free: false, pro: true },
    { label: "Trade tracker + templates", free: false, pro: true },
    { label: "Private community (moderated)", free: false, pro: true },
    { label: "Accountability & feedback", free: false, pro: true },
  ];

  // ================== JSX START ==================
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
            {/* live online pill */}
            <span className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/80 md:flex">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              {onlineNow} online now
            </span>
            <span className="uppercase tracking-wide text-white/70">Offer ends in</span>
            <span className="font-mono tabular-nums">
              {String(remaining.h).padStart(2, "0")}:
              {String(remaining.m).padStart(2, "0")}:
              {String(remaining.s).padStart(2, "0")}
            </span>
            <button
              onClick={() => setShowCheckout(true)}
              className="ml-2 rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-black md:text-sm"
            >
              Get Access for $29
            </button>
          </div>
        </div>
      </div>

      {/* Wall of Wins Marquee */}
      <div className="border-b border-white/10 bg-black/70">
        <div className="mx-auto max-w-6xl overflow-hidden px-4 py-2">
          <div className="nlt-marquee whitespace-nowrap text-xs text-white/80">
            {wallOfWins.concat(wallOfWins).map((w, i) => (
              <span key={i} className="mx-6 inline-flex items-center">
                <span className="mr-2 rounded-full bg-[#6C2BD9]/30 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#E5DEFF]">
                  Win
                </span>
                <span className="font-medium text-white/90">{w.name}</span>&nbsp;just&nbsp;{w.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(108,43,217,0.35),transparent_60%)]" />
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Turn Volatile Markets Into <span className="text-[#9B8AFB]">Predictable Profits</span>
            </h1>
            <p className="mt-4 max-w-xl text-white/80">
              Watch this short video to see how I find my setups daily — and how you can start trading alongside me inside the
              private room.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setShowVideo(true)}
                className="rounded-2xl bg-[#6C2BD9] px-5 py-3 text-base font-semibold text-white"
              >
                ▶ Watch 3-min VSL
              </button>
              <button
                onClick={() => setShowCheckout(true)}
                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-base font-semibold text-white"
              >
                Get Access for $29 →
              </button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/60">
              <div>🛡 7-Day Guarantee • Cancel Anytime</div>
              <div>👥 300+ Members Inside</div>
            </div>
          </div>

          {/* Proof Cards */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-b from-[#6C2BD9]/10 to-transparent blur-2xl" />
            <div className="grid gap-4">
              {/* Rotating Recent Plays */}
              <div
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <div className="mb-2 flex items-center gap-2 text-sm text-white/70">
                  <span className="relative inline-flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#9B8AFB] opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9B8AFB]" />
                  </span>
                  Recent Plays (auto)
                </div>
                <div className="font-medium text-white/90">{recentPlays[playIdx].h}</div>
                <div className="mt-1 text-sm text-white/70">{recentPlays[playIdx].d}</div>
                <div className="mt-4 h-1 w-full overflow-hidden rounded bg-white/10">
                  <div
                    key={playIdx}
                    className="h-full bg-[#9B8AFB]"
                    style={{ animation: "nlt-progress linear forwards", animationDuration: `${ROTATE_MS}ms` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-sm text-white/70">Member Shoutout</div>
                <div className="text-white/90">“Clear plan, defined risk. I finally stopped overtrading.” — J.R.</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-sm text-white/70">Receipts</div>
                <div className="text-white/90">Entries, risk, exits posted daily. No hype — just process.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid (simple) */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            What You Get Inside <span className="text-[#9B8AFB]">Premium</span>
          </h2>
          <p className="mt-2 text-white/70">A complete toolkit to shorten your learning curve and keep you disciplined.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-base font-semibold">{f.t}</div>
              <div className="mt-1 text-sm text-white/80">{f.d}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Value Stack with Pricing */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-center text-2xl font-bold">Everything You Get</h3>
          <div className="mt-6 divide-y divide-white/10">
            {valueStack.map((v) => (
              <div key={v.label} className="flex items-center justify-between py-3">
                <span className="text-white/85">{v.label}</span>
                <span className="font-mono text-white/70">${v.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-4">
            <span className="text-white/70">Total Real Value</span>
            <span className="font-mono text-lg">${valueTotal}</span>
          </div>
          <div className="mt-4 grid gap-3 text-center sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="text-sm text-white/70">Today Only</div>
              <div className="text-3xl font-extrabold text-[#E5DEFF]">$29</div>
              <div className="text-xs text-white/60">Price never changes. 7-day guarantee.</div>
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full rounded-2xl bg-[#6C2BD9] px-6 py-4 text-base font-semibold text-white"
              >
                Claim Access for $29
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Free vs Premium Comparison */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h3 className="mb-6 text-center text-2xl font-bold">Stay Free or Go Premium?</h3>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-4 py-3 text-left">Feature</th>
                <th className="px-4 py-3 text-center">Free</th>
                <th className="px-4 py-3 text-center">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {freeVsPremium.map((row) => (
                <tr key={row.label} className="bg-black/40">
                  <td className="px-4 py-3">{row.label}</td>
                  <td className="px-4 py-3 text-center">{row.free ? "✅" : "❌"}</td>
                  <td className="px-4 py-3 text-center">{row.pro ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowCheckout(true)}
            className="rounded-2xl bg-[#6C2BD9] px-6 py-4 text-base font-semibold text-white"
          >
            Upgrade to Premium — $29
          </button>
        </div>
      </section>

      {/* Offer + Testimonials */}
      <section className="relative overflow-hidden border-y border-white/10 bg-gradient-to-b from-[#6C2BD9]/10 to-transparent">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-extrabold sm:text-3xl">
              Get Full Access Today for <span className="text-[#9B8AFB]">$29</span>
            </h3>
            <p className="mt-3 max-w-xl text-white/80">Price never changes. Try it risk-free for 7 days. Cancel anytime.</p>
            <ul className="mt-6 space-y-2 text-white/80">
              <li>✓ Daily setups + live breakdowns</li>
              <li>✓ Beginner’s Crash Course ($199 value)</li>
              <li>✓ Trade Tracker Template ($49 value)</li>
              <li>✓ Private community + signals</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setShowCheckout(true)} className="rounded-2xl bg-[#6C2BD9] px-6 py-4 text-base font-semibold text-white">
                Get Access for $29
              </button>
              <button onClick={() => setShowVideo(true)} className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-base font-semibold text-white">
                Watch the VSL
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg font-semibold">Member Wins & Feedback</div>
            <div className="mt-4 space-y-4 text-sm text-white/85">
              <blockquote className="rounded-xl border border-white/10 bg-black/30 p-4">
                “I learned more in a week here than months on YouTube.” — A.M.
              </blockquote>
              <blockquote className="rounded-xl border border-white/10 bg-black/30 p-4">
                “Signals are clear, risk is mapped out. Took the stress out of my mornings.” — K.P.
              </blockquote>
              <blockquote className="rounded-xl border border-white/10 bg-black/30 p-4">
                “Made back my sub in one ETH move. Straight up worth it.” — J.R.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h4 className="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h4>
        <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
          {[
            { q: "What exactly is inside Premium?", a: "Daily setups, live commentary, a beginner-friendly course, and a private community." },
            { q: "Do you guarantee profits?", a: "No. Trading involves risk. We provide education and process — not financial advice." },
            { q: "Can I cancel anytime?", a: "Yes. Month-to-month. Cancel in a click inside your account." },
            { q: "I'm brand new — is this for me?", a: "Yes. Start with the Crash Course and trade tracker. Ask questions in chat." },
          ].map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-white/90 hover:bg-white/5">
                <span>{item.q}</span>
                <span className="text-white/50">⌄</span>
              </summary>
              <div className="px-5 pb-5 text-white/70">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Don't Miss Closer */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-2xl font-extrabold">Still Watching?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            Every day you wait is another clean setup you don’t take. The plan, the entries, the risk, the exits—it's all posted for you.
            Jump in, test it for 7 days, and decide with results—not guesses.
          </p>
          <div className="mt-6 text-sm text-white/70">
            Offer ends in{" "}
            <span className="font-mono">
              {String(remaining.h).padStart(2, "0")}:{String(remaining.m).padStart(2, "0")}:{String(remaining.s).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setShowCheckout(true)}
              className="rounded-2xl bg-[#6C2BD9] px-8 py-4 text-base font-semibold text-white"
            >
              Get Access for $29
            </button>
          </div>
          <div className="mt-3 text-xs text-white/60">100% Money-Back Guarantee within 7 Days</div>
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
              <iframe
                className="h-full w-full"
                src="https://player.vimeo.com/video/123456789?title=0&byline=0&portrait=0"
                title="No Limit Trades VSL"
                allow="autoplay; fullscreen; picture-in-picture"
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
            <div className="p-4">
              <div dangerouslySetInnerHTML={{ __html: CHECKOUT_EMBED_HTML }} />
              {!lpLoaded && <div className="mt-4 text-center text-white/60 text-sm">Loading secure checkout…</div>}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Checkout Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-3 md:flex-row">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-white/70">Offer expires in</span>
            <span className="font-mono tabular-nums">
              {String(remaining.h).padStart(2, "0")}:
              {String(remaining.m).padStart(2, "0")}:
              {String(remaining.s).padStart(2, "0")}
            </span>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            className="rounded-2xl bg-[#6C2BD9] px-5 py-3 text-white"
          >
            Get Access for $29
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-white/10 py-10 text-center text-xs text-white/50">
        <p>© {new Date().getFullYear()} No Limit Trades. All rights reserved.</p>
        <p className="mt-2">
          For education only. Not financial advice. Trading futures/crypto carries risk. Past results do not guarantee future returns.
        </p>
      </footer>
    </div>
  );
}

// ====== CSS additions (add to styles/globals.css) ======
//
// @keyframes nlt-progress {
//   from { width: 0%; }
//   to   { width: 100%; }
// }
//
// @keyframes nlt-marquee {
//   0%   { transform: translateX(0%); }
//   100% { transform: translateX(-50%); }
// }
// .nlt-marquee {
//   display: inline-block;
//   min-width: 200%;
//   animation: nlt-marquee 24s linear infinite;
// }
