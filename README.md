# Chekole Portfolio

React + Vite portfolio with an AI chat widget, certificate showcase, and Supabase-powered contact + notification system.

## Setup

```bash
npm install
```

Create `.env` at the project root:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key
```

Only `VITE_`-prefixed values are bundled into the browser, so the Gemini key is **not**
kept here. It is a Supabase Edge Function secret instead — see
[AI Chat Flow](#ai-chat-flow).

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

## AI Chat Flow

The chat widget never talks to Google directly, so the Gemini key stays off the client:

1. Browser posts `{ messages }` to the `gemini-chat` Edge Function (public anon key)
2. The function attaches the private `GEMINI_API_KEY` and calls the Gemini API
3. The Gemini response is returned to the browser unchanged

Required Supabase secrets:

```bash
supabase secrets set GEMINI_API_KEY=... GEMINI_MODEL=gemini-3.5-flash
supabase functions deploy gemini-chat
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
