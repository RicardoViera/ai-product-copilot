Features:

Authentication & Authorization:

    Clerk authentication

    Route protection via proxy.ts

    Server-enforced access control

    User syncing with Prisma (upsert on login)

Product Management:

Create and manage products

Each product has:

    AI chat workspace

    Document storage

    Vector search index

Document Upload & Indexing:

    File upload via Supabase Storage

    Server-side chunking

    OpenAI embeddings (text-embedding-3-small)

    Stored in Postgres using pgvector

    Background indexing with isIndexed tracking

AI Copilot Chat:

    Streaming responses (AI SDK v6)

    Context-aware RAG

    Vector similarity search with threshold + fallback

    Token-aware context budgeting

    Source attribution

UI/UX:

    Next.js App Router (Server Components)

    shadcn/ui + Tailwind CSS

    Responsive sidebar + hamburger menu

    Auto-scroll chat

    Scroll-to-bottom button

Tech Stack:

Frontend:

    Next.js 14+ (App Router)

    React Server Components

    Tailwind CSS

    shadcn/ui

Backend:

    Next.js Route Handlers

    Prisma 7 (adapter-pg)

    Supabase Postgres

    pgvector

AI:

    OpenAI GPT-4o-mini

    OpenAI embeddings

    AI SDK v6 (streaming)

Auth:

    Clerk

Storage:

    Supabase Storage

Architecture Overview:
RAG Flow

1- User uploads document

2- Server:

    Extracts text

    Splits into chunks

    Generates embeddings

    Stores in ProductDocChunk with vector column

3- User sends chat message

4- System:

    Embeds query

    Runs similarity search (<-> operator)

    Filters by distance threshold

    Builds context window

    Streams AI response

5- Sources appended to message


Setup
1- Clone repo: 
    git clone https://github.com/yourusername/ai-product-copilot.git
2- Install dependencies:
    Move into root directory: cd ai-product-copilot
    npm install

3- Environment variables

Create .env:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

4- Run Prisma migrations:
    npx prisma migrate deploy

5- Start dev server
    npm run dev

Why This Project?

This project demonstrates:

    Full-stack ownership

    AI integration beyond simple prompt calls

    Vector search + pgvector usage

    Server-first architecture

    Secure multi-tenant design

    Streaming UI

    Clean abstraction layers

    Production-ready patterns

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.