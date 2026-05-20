# Portfolio site (React + Vite)

Minimal portfolio built with React and Vite. Focuses on a responsive shell, a small AI chat widget, and a Supabase-powered contact form.

Quickstart
- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

Required environment variables (create a `.env` file at project root):
- `VITE_GROQ_API_KEY` — Groq AI API key used by the chat widget
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — Supabase project URL and anon key (contact form)

Example `.env` snippet:

VITE_GROQ_API_KEY=your_groq_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Troubleshooting
- Restart the dev server after editing `.env` so Vite picks up new env values.
- If the Groq chat returns 401, verify `VITE_GROQ_API_KEY` is valid and has required permissions.
- If TypeScript complains about `import.meta.env`, add a `vite-env.d.ts` with an `ImportMeta` augmentation or disable strict checks for the file.

If you want me to, I can add a short `vite-env.d.ts` snippet or update deploy instructions.
