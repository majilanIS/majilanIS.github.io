# Chekole Portfolio

React + Vite portfolio with an AI chat widget, certificate showcase, and Supabase-powered contact + notification system.

## Setup

```bash
npm install
```

Create `.env` at the project root:

```dotenv
VITE_GEMINI_API_KEY=your_key
VITE_GEMINI_MODEL=gemini-2.0-flash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key
```

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- **Frontend:** React, Vite, Framer Motion
- **UI:** Custom CSS, responsive layout, SVG icons
- **Backend:** Supabase Postgres, Edge Functions, database triggers
- **AI:** Gemini API

## Project Structure

```
src/
  components/
  assets/
  lib/
supabase/
  functions/
  patches/
```

## Supabase Notification Flow

1. Contact form inserts into `public.applicant`
2. Database trigger creates a row in `public.notification`
3. Webhook calls the `send-notification-email` Edge Function
4. Edge Function sends email via Resend

Required Supabase secrets:

```bash
supabase secrets set RESEND_API_KEY=... NOTIFY_TO=chekolengusalem@gmail.com RESEND_FROM="Portfolio <onboarding@resend.dev>"
```

## Deploy

**Vercel** — set the `VITE_*` env vars above, deploy as a Vite app.

**Supabase Edge Function:**

```bash
supabase functions deploy send-notification-email
```
