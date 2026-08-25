import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// @somos/config/vitest/react.ts doesn't enable Vitest's `test.globals`
// (explicit `import { describe, it, expect } from "vitest"` everywhere is
// preferred — no ambient globals to typecheck), so @testing-library/react's
// own auto-cleanup (which only registers when it detects a *global*
// `afterEach`) never fires on its own. Register it explicitly instead, so
// every render in one test file doesn't leak into the next.
afterEach(() => {
  cleanup();
});
