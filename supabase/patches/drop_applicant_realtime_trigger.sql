-- The trigger on public.applicant is incorrectly wired to realtime.subscription_check_filters.
-- That function expects claims/entity/filters fields that do not exist on applicant rows.
-- Dropping the trigger restores normal inserts into public.applicant.

DROP TRIGGER IF EXISTS applicant ON public.applicant;
