"use client";

import { useCompletion } from "@ai-sdk/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import ChatBox from "@/components/ChatBox";

type Preferences = {
  budget: string;
  fuelType: string;
  useCase: string;
  seating: string;
  transmission: string;
  priorities: string;
};

function ResultsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [prefs, setPrefs] = useState<Preferences | null>(null);

  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/recommend",
  });

  useEffect(() => {
    const raw = params.get("prefs");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      const parsed: Preferences = JSON.parse(decodeURIComponent(raw));
      setPrefs(parsed);
      complete("", { body: parsed });
    } catch {
      router.replace("/");
    }
  }, []);

  if (!prefs) return null;

  const budgetLabel = `₹${(Number(prefs.budget) / 100000).toFixed(0)}L`;

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🎯 Your Car Shortlist</h1>
            <p className="text-sm text-muted-foreground">
              AI-curated picks based on your profile
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            ← New Search
          </Button>
        </div>

        {/* Preference Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">💰 {budgetLabel}</Badge>
          <Badge variant="secondary">⛽ {prefs.fuelType}</Badge>
          <Badge variant="secondary">🚦 {prefs.useCase}</Badge>
          <Badge variant="secondary">💺 {prefs.seating}+ seats</Badge>
          <Badge variant="secondary">⚙️ {prefs.transmission}</Badge>
          {prefs.priorities && (
            <Badge variant="outline" className="italic">
              "{prefs.priorities}"
            </Badge>
          )}
        </div>

        {/* Loading */}
        {isLoading && !completion && (
          <Card>
            <CardContent className="pt-8 pb-8 text-center space-y-3">
              <p className="text-4xl animate-bounce">🤖</p>
              <p className="text-muted-foreground font-medium">
                Analyzing cars matching your profile...
              </p>
              <p className="text-xs text-muted-foreground">
                Querying database · Running AI analysis · Generating reasoning
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 pb-6 text-center space-y-3">
              <p className="text-red-600 font-medium">
                ⚠️ No cars found matching your criteria.
              </p>
              <Button variant="outline" size="sm" onClick={() => router.push("/")}>
                Try Different Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AI Recommendations — streamed */}
        {completion && (
          <Card className="shadow-md border-blue-100">
            <CardContent className="pt-6 prose prose-sm max-w-none">
              <ReactMarkdown>{completion}</ReactMarkdown>
            </CardContent>
          </Card>
        )}

        {/* Chat Follow-up — only show after recommendation loads */}
        {completion && !isLoading && (
          <ChatBox context={completion} />
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          Prices are indicative ex-showroom. Always verify with your local dealer.
        </p>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}