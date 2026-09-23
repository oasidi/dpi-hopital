# DPI Hôpital — Dossier Patient Informatisé

A hospital **electronic patient record** (Dossier Patient Informatisé) web application.
It lets hospital staff register patients, browse and search their records, and log
clinical consultations per patient.

## Tech stack

- **[Next.js 15](https://nextjs.org/)** (App Router) + **React 19** + **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com/)** for the UI
- **[Prisma ORM](https://www.prisma.io/)** with **SQLite** (zero external database service required)

The SQLite database keeps the whole stack self-contained — no external services are
needed to run or demo the app.

## Getting started

Prerequisites: **Node.js 20+** (the project is developed with Node 22).

```bash
# 1. Install dependencies
npm ci            # or: npm install

# 2. Generate the Prisma client and prepare the database
npx prisma generate
npx prisma migrate deploy   # applies migrations, creates prisma/dev.db
npx prisma db seed          # loads sample patients

# 3. Start the dev server
npm run dev
```

Then open http://localhost:3000.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run db:migrate` | Apply Prisma migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:reset` | Reset the database and re-run migrations + seed |

## Project structure

```
prisma/
  schema.prisma        # Patient & Consultation data models (SQLite)
  seed.ts              # Sample patients + consultations
  migrations/          # Committed Prisma migrations
src/
  app/
    layout.tsx         # App shell / navigation
    page.tsx           # Patient list + search + stats
    actions.ts         # Server actions (create patient, add consultation)
    patients/new/      # New patient form
    patients/[id]/     # Patient detail + consultations
  lib/
    prisma.ts          # Prisma client singleton
    format.ts          # Date / age formatting helpers
```

## Environment variables

`DATABASE_URL` points at the local SQLite file and is committed in `.env`
(`file:./dev.db`). It contains no secrets.

## Cloud Agent environment

`.cursor/environment.json` configures the Cloud Agent development environment:
`install` prepares dependencies, the Prisma client, the database, and seed data,
and a `next-dev` terminal runs the dev server on port 3000.
