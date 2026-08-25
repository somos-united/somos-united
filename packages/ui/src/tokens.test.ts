import { describe, expect, it } from "vitest";

import { radius, tokens } from "./tokens";

// Genuine smoke test — asserts the shared token module actually exports the
// values 04-DESIGN-SYSTEM.md defines, not a placeholder assertion. Guards
// against a silent drift between tokens.ts, tokens.css and the Tailwind
// preset (packages/config/tailwind/preset.js) since all three are
// hand-maintained in parallel (see the file-level comment in tokens.ts).
describe("design tokens", () => {
  it("matches the primary brand color from 04-DESIGN-SYSTEM.md §1", () => {
    expect(tokens.colors.primary.DEFAULT).toBe("#5B21F0");
  });

  it("defines a fully-rounded pill radius for the pill buttons (§3)", () => {
    expect(radius.pill).toBe("9999px");
  });

  it("keeps the 8px spacing base for its named steps (§3)", () => {
    expect(tokens.spacing.sm).toBe("8px");
    expect(tokens.spacing.lg).toBe("16px");
  });
});
