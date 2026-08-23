# Chekole Portfolio

An expressive React + Vite portfolio for Chekole Ngusalem. The site combines a polished landing page, certificate showcase, an AI chat widget, and a Supabase-powered contact + notification pipeline.

## Highlights

- Fast Vite build with a responsive, single-page layout.
- AI chat widget powered by Groq.
- Certificate gallery with downloadable assets.
- Contact form that writes to Supabase.
- Database-triggered notifications stored in `public.notification`.
- Email delivery handled server-side through a Supabase Edge Function.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, Framer Motion |
| UI | Custom CSS, responsive layout, SVG icons |
| Backend | Supabase Postgres, database triggers, Edge Functions |
| AI | Groq API |

## Project Structure

```text
src/
	components/
	assets/
	lib/
supabase/
	functions/
	patches/
```

## Local Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file at the project root:

```dotenv
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_GEMINI_MODEL=gemini-3.6-flash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RESENT_API_KEY=THIS IS LATER PUT TO THE BACKEND ON THE PRODUCTION BUILD
```

## Supabase Notification Flow

1. The contact form inserts a row into `public.applicant`.
2. A database trigger creates a matching row in `public.notification`.
3. A Supabase database webhook watches `public.notification`.
4. The webhook calls the `send-notification-email` Edge Function.
5. The Edge Function sends the email to `chekolengusalem@gmail.com`.

Required Supabase secrets:

```bash
RESEND_API_KEY
NOTIFY_TO
RESEND_FROM
```

## Deployment

### Vercel

Set these environment variables in Vercel:

- `VITE_GEMINI_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then deploy the repository as a Vite application.

### Supabase

Deploy the edge function from the repo:

```bash
supabase functions deploy send-notification-email
```

If you update secrets:

```bash
supabase secrets set RESEND_API_KEY=... NOTIFY_TO=chekolengusalem@gmail.com RESEND_FROM="Portfolio <onboarding@resend.dev>"
```

## Notes

- `.env` stays local and is already ignored by Git.
- The repository no longer depends on client-side email sending.
- The notification workflow is now fully server-side and easier to maintain.
