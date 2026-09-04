import type { MetadataRoute } from "next";

import { SUPPORTED_LOCALES } from "@/lib/locales";

const BASE_URL = "https://www.somosunited.ch";

/**
 * Only the real live public site (the holding page) - /preview/* is
 * gated and explicitly excluded via robots.ts, so it doesn't belong
 * here either. Extend this once /preview content is promoted to be
 * the real public site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return SUPPORTED_LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
  }));
}
