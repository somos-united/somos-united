/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Internal workspace packages are consumed as TS source, not pre-built —
  // Next transpiles them itself (01-ARCHITECTURE.md §1/§2).
  transpilePackages: ["@somos/ui"],
};

export default nextConfig;
