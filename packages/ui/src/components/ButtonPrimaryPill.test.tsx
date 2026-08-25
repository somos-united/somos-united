import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ButtonPrimaryPill } from "./ButtonPrimaryPill";

// Genuine render smoke test (real @testing-library/react + jsdom, not a
// placeholder assertion) — proves the shared Vitest "react" preset
// (@somos/config/vitest/react) actually renders a component and proves the
// component itself matches its documented spec (04-DESIGN-SYSTEM.md §6:
// fill primary, rounded pill, defaults to type="button" so it never
// accidentally submits a surrounding form).
describe("ButtonPrimaryPill", () => {
  it("renders a native button with its label and the primary-pill styling", () => {
    render(<ButtonPrimaryPill>Module entdecken</ButtonPrimaryPill>);

    const button = screen.getByRole("button", { name: "Module entdecken" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.className).toContain("rounded-pill");
    expect(button.className).toContain("bg-primary");
  });

  it("does not default to a submit button", () => {
    render(<ButtonPrimaryPill>Absenden</ButtonPrimaryPill>);

    expect(screen.getByRole("button").getAttribute("type")).not.toBe("submit");
  });
});
