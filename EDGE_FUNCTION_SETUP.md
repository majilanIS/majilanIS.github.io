# Email Notifications Setup Guide

This portfolio now sends email notifications when:
1. Someone fills out the contact form (HireMe)
2. Someone sends a message via the AI chat widget

## Prerequisites

- Supabase account (free tier works)
- Resend account (free tier works)
- Supabase CLI installed: `npm install -g supabase`

## Setup Steps

### 1. Create Resend Account & Get API Key

1. Go to [resend.com](https://resend.com) and sign up
2. Create a verified domain or use the free `onboarding_email@resend.dev` test sender
3. Copy your **Resend API Key** (starts with `re_`)

### 2. Add Resend API Key to Supabase

1. Go to [supabase.com](https://supabase.com) → Your Project → Settings → Environment Variables
2. Add a new secret:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key from step 1

### 3. Update the Edge Function

In `supabase/functions/send-email/index.ts`, line 40:
```typescript
from: "noreply@your-domain.com", // ← Replace with your verified Resend domain or use onboarding_email@resend.dev
```

### 4. Deploy the Edge Function

From your project root:
```bash
supabase link --project-id YOUR_SUPABASE_PROJECT_ID
supabase functions deploy send-email
```

(Get `YOUR_SUPABASE_PROJECT_ID` from Supabase dashboard → Settings)

### 5. Verify `.env` Variables

Make sure your `.env` has:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GROQ_API_KEY=your_groq_key
```

### 6. Restart Dev Server

```bash
npm run dev
```

## Testing

1. **Contact Form:** Fill out the form and submit. You should receive an email at `chekolengusalem@gmail.com`
2. **Chat Widget:** Send a message via the AI chat. You should receive an email notification.

## Troubleshooting

- **401 Unauthorized:** Check that `RESEND_API_KEY` is set correctly in Supabase
- **Function not found:** Verify the Edge Function deployed successfully: `supabase functions list`
- **Emails not arriving:** Check your Resend domain is verified (use `onboarding_email@resend.dev` for testing)
- **CORS errors:** The Edge Function has CORS headers enabled; if issues persist, check Supabase logs

## Files Modified

- `supabase/functions/send-email/index.ts` — Main email logic
- `supabase/functions/_shared/cors.ts` — CORS helpers
- `src/components/HireMe.jsx` — Calls Edge Function after form submission
- `src/components/ChatGroq.tsx` — Calls Edge Function after chat message
