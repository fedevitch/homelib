/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    mode: "development"
  },
  i18n: {
    locales: ['ua', 'en'],
    defaultLocale: 'ua',
    localeDetection: false
  },
  api: {
    responseLimit: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
