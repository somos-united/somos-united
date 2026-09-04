import type { MetadataRoute } from "next";

/**
 * /preview/* is the gated design-review environment (Basic Auth,
 * middleware.ts) - explicitly disallowed here so it's never crawled or
 * indexed even accidentally, on top of the auth gate itself. Update this
 * once /preview content is promoted to be the real public site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/preview/",
    },
    sitemap: "https://www.somosunited.ch/sitemap.xml",
  };
}
