-- Ensure `entity` exists as regclass so triggers that use NEW.entity can compare it
-- to other regclass values without a regclass = text operator error.
-- Run this in the Supabase SQL editor or via psql/supabase CLI.

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'applicant'
			AND column_name = 'entity'
	) THEN
		ALTER TABLE public.applicant
		ADD COLUMN entity regclass;
	ELSIF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'applicant'
			AND column_name = 'entity'
			AND data_type = 'text'
	) THEN
		ALTER TABLE public.applicant
		ALTER COLUMN entity TYPE regclass
		USING COALESCE(NULLIF(entity, '')::regclass, 'public.applicant'::regclass);
	END IF;

	ALTER TABLE public.applicant
	ALTER COLUMN entity SET DEFAULT 'public.applicant'::regclass;

	ALTER TABLE public.applicant
	ALTER COLUMN entity SET NOT NULL;
END $$;

-- After running this, confirm the type with:
-- SELECT column_name, data_type, udt_name
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'applicant' AND column_name = 'entity';
