import { Link } from "react-router-dom";
import { ArrowRight, PhoneMissed, ClipboardList, MessageSquareText, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_IMG =
  "https://images.unsplash.com/photo-1775396042188-64ec280ca175?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29scyUyMGRhcmt8ZW58MHx8fHwxNzgzMjk5MjI4fDA&ixlib=rb-4.1.0&q=85";

export default function Home() {
  return (
    <div className="fade-up" data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-zinc-950/85" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/50 to-transparent" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div
              data-testid="hero-eyebrow"
              className="inline-flex items-center gap-2 border border-orange-500/40 bg-orange-500/10 px-3 py-1 rounded-sm mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-orange-400">
                Demo MVP — Local Data Only
              </span>
            </div>

            <h1
              data-testid="hero-title"
              className="font-display font-black text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-zinc-50 leading-[0.95]"
            >
              Recover missed <br />
              contractor leads <br />
              <span className="text-orange-500">before they go cold.</span>
            </h1>

            <p
              data-testid="hero-subtitle"
              className="mt-8 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed"
            >
              Every missed call is a job someone else booked. LocalOps captures the lead,
              tracks it, and gives you a safe follow-up message you can send in seconds.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                asChild
                data-testid="hero-cta-dashboard"
                className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold uppercase tracking-wider rounded-sm px-8 py-6 text-base"
              >
                <Link to="/dashboard">
                  Open Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                data-testid="hero-cta-capture"
                className="bg-transparent border-zinc-700 hover:bg-zinc-900 text-zinc-100 font-bold uppercase tracking-wider rounded-sm px-8 py-6 text-base"
              >
                <Link to="/capture">Capture a Lead</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 max-w-lg gap-6 border-t border-zinc-800 pt-6">
              <Stat value="30s" label="To log a lead" />
              <Stat value="4" label="Status stages" />
              <Stat value="0" label="Setup required" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-4">
            /// How it works
          </p>
          <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-zinc-50">
            Three moves. Zero cold leads.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            step="01"
            icon={PhoneMissed}
            title="Capture"
            body="Log missed calls, texts, and web form leads in under 30 seconds. Nothing falls through the cracks."
            testid="feature-capture"
          />
          <FeatureCard
            step="02"
            icon={ClipboardList}
            title="Organize"
            body="See every open lead in one dashboard. Move them from New → Contacted → Booked with one tap."
            testid="feature-organize"
          />
          <FeatureCard
            step="03"
            icon={MessageSquareText}
            title="Follow Up"
            body="Generate a safe, professional follow-up message from proven templates. Copy, send, book the job."
            testid="feature-followup"
          />
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-4">
              /// Built for the truck, not the desk
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-zinc-50 mb-8">
              You bid the work. <br />We bring it back.
            </h2>
            <ul className="space-y-4">
              {[
                "Mobile-friendly — works from the job site.",
                "No integrations, no accounts, no BS. Just a clean pipeline.",
                "Follow-up templates written by real contractors.",
                "Every lead is timestamped so you know what to chase first.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-zinc-300 text-lg">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button
                asChild
                data-testid="secondary-cta-dashboard"
                className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold uppercase tracking-wider rounded-sm px-8 py-6 text-base"
              >
                <Link to="/dashboard">
                  See the demo <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="border border-zinc-800 bg-zinc-900/60 rounded-sm p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                  Sample Follow-up
                </span>
              </div>
              <p className="mt-6 text-zinc-200 leading-relaxed">
                Hi Marcus, this is Redline Plumbing. Sorry we missed your call about your
                water heater. We&apos;d love to help — what&apos;s the best time today or tomorrow
                for a quick call to go over the details?
              </p>
              <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-widest text-zinc-500">
                <span>Template: Standard</span>
                <span className="text-orange-500 font-bold">Ready to send</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} LocalOps — Demo MVP</span>
          <span className="text-xs uppercase tracking-widest">
            No real SMS · No real payments · Local data only
          </span>
        </div>
      </footer>
    </div>
  );
}

const Stat = ({ value, label }) => (
  <div>
    <div className="font-display font-black text-3xl text-zinc-50 tracking-tight">{value}</div>
    <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">{label}</div>
  </div>
);

const FeatureCard = ({ step, icon: Icon, title, body, testid }) => (
  <div
    data-testid={testid}
    className="group relative border border-zinc-800 bg-zinc-900/40 rounded-sm p-8 hover:border-orange-500/60 hover:bg-zinc-900 transition-all"
  >
    <div className="flex items-start justify-between mb-6">
      <span className="grid place-items-center w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-sm group-hover:border-orange-500 transition-colors">
        <Icon className="w-6 h-6 text-orange-500" strokeWidth={2} />
      </span>
      <span className="font-display font-black text-3xl text-zinc-800 group-hover:text-orange-500/40 transition-colors">
        {step}
      </span>
    </div>
    <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-zinc-50 mb-3">
      {title}
    </h3>
    <p className="text-zinc-400 leading-relaxed">{body}</p>
  </div>
);
