import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { budget, fuelType, useCase, seating, transmission, priorities } =
    await req.json();

  console.log("🔍 Query params:", { budget, fuelType, useCase, seating, transmission });
  console.log("✅ OpenAI key loaded:", !!process.env.OPENAI_API_KEY);

  let cars = await prisma.car.findMany({
    where: {
      price: { lte: Number(budget) },
      ...(fuelType && fuelType !== "any" ? { fuelType } : {}),
      ...(seating ? { seatingCap: { gte: Number(seating) } } : {}),
      ...(transmission && transmission !== "any" ? { transmission } : {}),
      ...(useCase && useCase !== "any"
        ? { useCase: { contains: useCase, mode: "insensitive" } }
        : {}),
    },
    orderBy: { safetyRating: "desc" },
    take: 10,
  });

  console.log(`🚗 Cars found: ${cars.length}`);

  // Fallback — relax filters if no cars found
  if (cars.length === 0) {
    cars = await prisma.car.findMany({
      where: {
        price: { lte: Number(budget) },
        ...(fuelType && fuelType !== "any" ? { fuelType } : {}),
      },
      orderBy: { safetyRating: "desc" },
      take: 10,
    });
  }

  // Last resort fallback — just return top 10 by budget
  if (cars.length === 0) {
    cars = await prisma.car.findMany({
      where: { price: { lte: Number(budget) } },
      orderBy: { safetyRating: "desc" },
      take: 10,
    });
  }

  if (cars.length === 0) {
    return new Response(
      JSON.stringify({ error: "No cars found. Try increasing your budget." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const carsContext = cars
    .map(
      (c) =>
        `${c.make} ${c.model} ${c.variant ?? ""} (${c.year}) | ₹${(
          c.price / 100000
        ).toFixed(1)}L | ${c.fuelType} | ${c.transmission} | ${
          c.mileageKmpl ? c.mileageKmpl + " kmpl" : "Electric"
        } | ${c.seatingCap} seats | Safety: ${c.safetyRating}★ | Features: ${c.features}`
    )
    .join("\n");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are an expert car advisor for Indian buyers. Given a buyer's preferences and a list of matching cars from the database, recommend the top 3-4 best-fit cars.

For each recommendation use this format:
## 🚗 [Car Name] — ₹[Price]L
**Why it fits you:** 2-3 lines specific to this buyer's needs
**Standout features:** bullet list of 3 relevant features  
**Trade-off:** one honest downside to be aware of

Be concise, friendly, and confident.`,
    prompt: `Buyer Profile:
- Budget: ₹${(Number(budget) / 100000).toFixed(1)} Lakhs
- Fuel Preference: ${fuelType}
- Primary Use: ${useCase}
- Minimum Seats Needed: ${seating}
- Transmission: ${transmission}
- Additional Priorities: ${priorities || "None"}

Available Cars from Database:
${carsContext}

Recommend the best 3-4 cars for this buyer with clear reasoning.`,
  });

  // ✅ AI SDK v5 correct method
  return result.toTextStreamResponse();
}
