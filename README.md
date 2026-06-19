# Mileage Tracker 2026

A retro 8-bit styled fitness mileage tracker for walking, biking, and swimming toward a 739-mile goal (Layton, UT → San Clemente, CA).

## Setup

### 1. Create the Supabase table

In your Supabase project SQL editor, run:

```sql
CREATE TABLE mileage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date date UNIQUE NOT NULL,
  walk_miles numeric DEFAULT 0,
  bike_miles numeric DEFAULT 0,
  swim_miles numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install and run locally

```bash
npm install
npm run dev
```

### 4. Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in Vercel project settings
4. Deploy — Vercel auto-detects Vite
