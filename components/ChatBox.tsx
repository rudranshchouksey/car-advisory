"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User, Zap } from "lucide-react";

type Props = { context: string };

const SUGGESTIONS = [
  "Which has best mileage?",
  "Calculate EMI for top pick",
  "Which is safest option?",
];

export default function ChatBox({ context }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { context },
    }),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: "I've analyzed your picks above. Ask me about maintenance, real-world mileage, or resale value!" }],
      },
    ],
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return;
    setShowSuggestions(false);
    sendMessage(text.trim());
    setInput("");
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden rounded-3xl ring-1 ring-slate-200">
      {/* Dynamic Header */}
      <CardHeader className="pb-4 pt-5 px-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg">
                <Bot size={20} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                CarAdvisor Assistant
              </CardTitle>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Always Online • Expert Mode
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 flex items-center gap-1.5">
             <Zap size={12} className="text-blue-600 fill-blue-600" />
             <span className="text-[10px] font-bold text-blue-700">AI PRO</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-100 px-6">
          <div className="space-y-6 py-6">
            {messages.map((m) => {
              const text = m.parts
                ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text).join("") ?? (m as any).content ?? "";

              if (!text.trim()) return null;
              const isUser = (m.role as string) === "user";

              return (
                <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    isUser ? "bg-slate-900 text-white" : "bg-blue-100 text-blue-600"
                  }`}>
                    {isUser ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  
                  <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                      isUser 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                    }`}>
                      <div className="prose prose-sm max-w-none prose-p:my-0 prose-invert">
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                      {isUser ? "You" : "Assistant"}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="p-5 border-t border-slate-100 bg-slate-50/30">
          {/* Quick suggestion chips */}
          {showSuggestions && (
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-xl border border-blue-100 bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex gap-2 relative"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up question..."
              disabled={isLoading}
              className="pr-12 bg-white border-slate-200 rounded-2xl h-12 text-sm shadow-inner focus-visible:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="absolute right-1.5 top-1.5 h-9 w-9 rounded-xl bg-slate-900 hover:bg-blue-600 transition-colors"
            >
              <Send size={16} />
            </Button>
          </form>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Sparkles size={10} className="text-slate-400" />
            <p className="text-[10px] text-slate-400 font-medium">AI can make mistakes. Check key details.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}