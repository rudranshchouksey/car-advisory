# CarAdvisor AI

A full-stack AI-powered car recommendation tool that helps confused Indian car buyers go from "I don't know what to buy" to a confident shortlist in under 60 seconds.

## What I Built & Why

A guided questionnaire (budget, fuel, use case, seating, transmission) that queries a real PostgreSQL database of 30 curated Indian cars, then uses GPT-4o-mini to generate a personalized shortlist with reasoning tailored to the buyer's profile.

**Deliberately cut:**
- User auth / profiles
- Car comparison table
- Image galleries per car
- EMI calculator
- Admin/CMS for adding cars

## Tech Stack

- **Next.js 14** (App Router + API Routes) — one repo, full-stack, instant Vercel deploy
- **TypeScript** — type safety without ceremony
- **Prisma + NeonDB (PostgreSQL)** — real persistence, seeded car dataset
- **Vercel AI SDK + GPT-4o-mini** — streaming AI responses, cheapest capable model
- **Tailwind + shadcn/ui** — fast, clean UI without design time

## AI Tool Usage

- **GitHub Copilot**: API route boilerplate, Prisma queries, component props
- **ChatGPT**: System prompt tuning for the recommendation engine
- **Manual**: Data modeling, product scoping decisions, seed data curation, prompt engineering

Tools helped most with: boilerplate elimination and component structure.  
Got in the way when: Copilot suggested overly complex state management — reverted to simpler useState.

## If I Had 4 More Hours

1. Streaming car cards alongside AI text (parse structured JSON from AI)
2. Follow-up chat: "Is there anything under ₹12L with a sunroof?"
3. Car comparison side-by-side
4. Share shortlist via unique URL

## Running Locally

\`\`\`bash
git clone <repo>
cd car-advisor
npm install
# Add .env with DATABASE_URL and OPENAI_API_KEY
npx prisma db push
npx prisma db seed
npm run dev
\`\`\`
