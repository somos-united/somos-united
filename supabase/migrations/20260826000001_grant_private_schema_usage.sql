-- =============================================================================
-- Fix: the `private` schema created in 20260826000000 was never granted
-- USAGE to authenticated/anon. Unlike the built-in `public` schema, a
-- newly created schema grants no privileges to PUBLIC by default — that's a
-- separate privilege from EXECUTE on the individual functions inside it.
-- Without this, every RLS policy calling a private.* function raises
-- "permission denied for schema private" for real (non-superuser) callers —
-- verified live: has_schema_privilege('authenticated', 'private', 'USAGE')
-- returned false before this migration.
-- =============================================================================

grant usage on schema private to authenticated, anon, service_role;
