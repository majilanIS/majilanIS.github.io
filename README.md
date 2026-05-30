# Portfolio site (React + Vite)

Personal portfolio built with React and Vite. It includes the landing page, chat widget, certificates section, and a Supabase-backed contact flow.

Quickstart
- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

Environment variables
- `VITE_GROQ_API_KEY` — Groq AI API key used by the chat widget
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — Supabase project URL and anon key

Supabase setup
- Contact form inserts into `public.applicant`
- A database trigger creates rows in `public.notification`
- A database webhook on `public.notification` sends notification emails through the `send-notification-email` Edge Function
- Set these Supabase function secrets: `RESEND_API_KEY`, `NOTIFY_TO`, `RESEND_FROM`

Notes
- Keep `.env` out of Git; it is already ignored.
- The notification email flow now uses Supabase secrets and server-side webhook delivery only.
