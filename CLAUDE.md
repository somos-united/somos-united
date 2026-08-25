# Somos United — Working Rules for Claude Code

Full plan lives in `md/` (`00-MASTER-PLAN.md` is the top authority; module docs for details). Read there for architecture/product decisions. This file is process rules only.

## Before merging anything to `main`

1. Run the `security-review` skill on the diff. No merge without a pass — this is the project's standing security gate (agreed with Danny 2026-08-24), since Snyk/Socket (CI, see `01-ARCHITECTURE.md` §9) only cover third-party dependencies, not first-party code.
2. `pnpm turbo run lint typecheck test build` must be green.

## Tooling budget

Danny's explicit constraint (2026-08-24): **prefer free tiers for any new tool/service** added to the stack, beyond what's already decided in `02-DEPLOYMENT.md`. Flag paid tiers before adding them rather than assuming it's fine.

## No-hardcoding principle

Restated from `00-MASTER-PLAN.md` §0 because it governs every implementation decision: any value that can change during business operation (prices, discounts, cancellation/refund rules, payroll deduction rates, rents, addresses, phone numbers, legal text) lives admin-editable in Supabase or Sanity — never hardcoded in application code.

## Communicating with Danny

Non-technical status updates — no unexplained jargon (`00-MASTER-PLAN.md` §0.5). He is the owner/consultant reviewer, not a developer.
