This is a modern Next.js application featuring:
- 🤖 **AI Chat** with Perplexity Sonar Reasoning Pro
- 🛡️ **Authentication** with Clerk
- 📊 **Dashboard** with farming insights
- 🎨 **Beautiful UI** with Tailwind CSS & shadcn/ui
- ⚡ **Typewriter Effect** for engaging chat experience
- 🧠 **AI Thinking Display** for transparency
- 📝 **Markdown Formatting** for rich responses

## Setup

### Quick Start (5 minutes)
1. **Install dependencies**: `npm install`
2. **Set up chat storage**: Follow `QUICK_START.md` for simple Supabase setup
3. **Add environment variables** to `.env.local`:
   - Clerk keys (see `CLERK_SETUP.md`)
   - Perplexity API key (see `PERPLEXITY_SETUP.md`)
   - Supabase keys (see `QUICK_START.md`)
4. **Run**: `npm run dev`

### Full Setup (Optional)
For complete database schema with fields, alerts, etc., see `SUPABASE_SETUP.md`

## Getting Started

Run the development server:

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
