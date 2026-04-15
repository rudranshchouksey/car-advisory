"use client";

import { useState, useRef } from "react";
import QuestionnaireForm, {
  Preferences,
} from "../components/QuestionaireForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";

const ChatBoxWrapper = dynamic(() => import("@/components/ChatBox"), {
  ssr: false,
  loading: () => null,
});

const FUEL_EMOJI: Record<string, string> = {
  Petrol: "⛽",
  Diesel: "🛢️",
  Electric: "⚡",
  CNG: "🌿",
  Hybrid: "♻️",
  any: "🔄",
};

const USE_EMOJI: Record<string, string> = {
  city: "🏙️",
  highway: "🛣️",
  family: "👨‍👩‍👧",
  offroad: "🏔️",
  any: "🗺️",
};

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (p: Preferences) => {
    setPrefs(p);
    setSubmitted(true);
    setCompletion("");
    setError(false);
    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        setError(true);
        setIsLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setCompletion((prev) => prev + chunk);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setSubmitted(false);
    setPrefs(null);
    setCompletion("");
    setError(false);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Nav Bar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg tracking-tight">
              Car<span className="gradient-text">Advisor</span> AI
            </span>
          </div>
          <Badge variant="secondary" className="text-xs font-normal">
            Powered by GPT-4o mini
          </Badge>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        {!submitted && (
          <div className="text-center space-y-3 py-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              AI-Powered · Real Database · Instant Results
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Find your{" "}
              <span className="gradient-text">perfect car</span>
              <br />in 30 seconds
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Answer 5 quick questions. Our AI scans 30+ cars and shortlists
              the best matches — with clear reasoning.
            </p>
          </div>
        )}

        {/* Stats strip */}
        {!submitted && (
          <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
            {[
              { label: "Cars in Database", value: "30+" },
              { label: "Filters Applied", value: "5" },
              { label: "Avg. Response", value: "<3s" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border rounded-xl p-4 text-center shadow-sm"
              >
                <p className="text-2xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        {!submitted && (
          <div className="animate-fade-in-up">
            <QuestionnaireForm onSubmit={handleSubmit} loading={isLoading} />
          </div>
        )}

        {/* Results */}
        {submitted && (
          <div className="space-y-5 animate-fade-in-up">

            {/* Results header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">🎯 Your Shortlist</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  AI-curated picks based on your profile
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs"
              >
                ← New Search
              </Button>
            </div>

            {/* Preference chips */}
            {prefs && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs py-1">
                  💰 ₹{(Number(prefs.budget) / 100000).toFixed(0)}L Budget
                </Badge>
                <Badge variant="outline" className="text-xs py-1">
                  {FUEL_EMOJI[prefs.fuelType] ?? "⛽"} {prefs.fuelType}
                </Badge>
                <Badge variant="outline" className="text-xs py-1">
                  {USE_EMOJI[prefs.useCase] ?? "🗺️"} {prefs.useCase}
                </Badge>
                <Badge variant="outline" className="text-xs py-1">
                  💺 {prefs.seating}+ seats
                </Badge>
                <Badge variant="outline" className="text-xs py-1">
                  ⚙️ {prefs.transmission}
                </Badge>
                {prefs.priorities && (
                  <Badge
                    variant="secondary"
                    className="text-xs py-1 italic max-w-xs truncate"
                  >
                    "{prefs.priorities}"
                  </Badge>
                )}
              </div>
            )}

            {/* Loading */}
            {isLoading && !completion && (
              <Card className="border-0 shadow-md bg-white">
                <CardContent className="pt-10 pb-10 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-3xl animate-bounce">
                        🤖
                      </div>
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">
                      Analyzing your profile...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Querying database · Scoring cars · Generating insights
                    </p>
                  </div>
                  <div className="flex justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error */}
            {error && (
              <Card className="border-red-100 bg-red-50 shadow-sm">
                <CardContent className="pt-6 pb-6 text-center space-y-3">
                  <p className="text-3xl">😕</p>
                  <p className="text-red-600 font-medium text-sm">
                    Something went wrong. Please try again.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

           {/* AI Response Section */}
            {completion && (
              <div className="space-y-6 animate-fade-in-up">
                {/* If you can't change the API to JSON, we polish the Markdown Container */}
                <Card className="border-0 shadow-xl bg-white overflow-hidden rounded-3xl ring-1 ring-slate-200">
                  <div className="h-2 w-full bg-linear-to-r from-blue-600 via-violet-500 to-cyan-400" />
                  <CardContent className="pt-8 pb-8 px-8">
                    <div className="prose prose-slate max-w-none 
                      prose-headings:text-slate-900 prose-headings:font-bold 
                      prose-p:text-slate-600 prose-p:leading-relaxed
                      prose-strong:text-blue-700 prose-strong:font-bold
                      prose-ul:list-none prose-ul:pl-0">
                      
                      {/* Customizing how Markdown looks to make it feel like "Cards" */}
                      <ReactMarkdown
                        components={{
                          h3: ({node, ...props}) => (
                            <h3 className="flex items-center gap-2 text-2xl mb-2 pt-4 border-t border-slate-100 first:border-0" {...props} />
                          ),
                          li: ({node, ...props}) => (
                            <li className="inline-flex bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mr-2 mb-2 border border-blue-100" {...props} />
                          ),
                          strong: ({node, ...props}) => (
                            <span className="block text-xs uppercase tracking-widest text-slate-400 mt-4 mb-1" {...props} />
                          )
                        }}
                      >
                        {completion}
                      </ReactMarkdown>
                    </div>
                    
                    {isLoading && (
                      <div className="flex items-center gap-2 mt-4 text-blue-600 font-medium">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                        <span className="text-sm">Generating deep insights...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Divider + Chat */}
            {completion && !isLoading && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-muted-foreground bg-[#f8fafc] px-2">
                    💬 Have questions about these cars?
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <ChatBoxWrapper context={completion} />
              </div>
            )}

            {/* Footer */}
            {completion && !isLoading && (
              <p className="text-center text-xs text-muted-foreground pb-2">
                💡 Ex-showroom prices, indicative only. Always confirm with
                your dealer.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}