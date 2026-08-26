import { describe, expect, it } from "vitest";

import { detectLocale } from "./detect-locale";

describe("detectLocale", () => {
  it("falls back to de when the header is missing", () => {
    expect(detectLocale(null)).toBe("de");
  });

  it("picks en when it's the only supported locale present", () => {
    expect(detectLocale("fr-FR,fr;q=0.9,en;q=0.8")).toBe("en");
  });

  it("picks de for a de-CH primary tag", () => {
    expect(detectLocale("de-CH,de;q=0.9,en;q=0.5")).toBe("de");
  });

  it("respects q-value ordering when en is preferred over de", () => {
    expect(detectLocale("de;q=0.5,en;q=0.9")).toBe("en");
  });

  it("falls back to de when no supported locale is present", () => {
    expect(detectLocale("fr-FR,fr;q=0.9,it;q=0.8")).toBe("de");
  });
});
