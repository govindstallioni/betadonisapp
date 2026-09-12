import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Static export. Per the Next.js docs for v15, this is a config flag — the
  // `next export` CLI command was removed in v14.0.0. `next build` now writes
  // the export to out/.
  output: 'export',

  // Emits out/about/index.html rather than out/about.html, so Apache on shared
  // cPanel serves /about/ with no .htaccess rewrite rules at all.
  trailingSlash: true,
}

export default nextConfig
