import { openai } from "@/lib/openai";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Log exact body to see what AI SDK v5 sends
  console.log("📨 Chat body keys:", Object.keys(body));
  console.log("📨 Chat body:", JSON.stringify(body).slice(0, 300));

  const context: string = body.context ?? "";

  // AI SDK v5 DefaultChatTransport sends messages as UIMessage[]
  // Extract plain text from parts to build a simple message history
  const rawMessages = body.messages ?? [];

  // Convert UIMessage parts → simple { role, content } for streamText
  const messages = rawMessages
    .filter((m: { role: string }) => m.role === "user" || m.role === "assistant")
    .map((m: { role: string; parts?: { type: string; text?: string }[]; content?: string }) => ({
      role: m.role as "user" | "assistant",
      content:
        m.parts
          ?.filter((p) => p.type === "text")
          .map((p) => p.text ?? "")
          .join("") ?? m.content ?? "",
    }))
    .filter((m: { content: string }) => m.content.trim().length > 0);

  console.log("💬 Converted messages:", messages.length);

  if (messages.length === 0) {
    return new Response("No messages", { status: 400 });
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a helpful car advisor for Indian buyers.
The buyer has already received a shortlist. Here is the context:

${context}

Answer follow-up questions about comparisons, mileage, EMI (use 9% interest, 5yr tenure), variants, safety, etc.
Be concise, friendly, and specific.`,
    messages,
  });

  return result.toUIMessageStreamResponse();
}