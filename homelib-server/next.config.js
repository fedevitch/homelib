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
  }
}

module.exports = nextConfig
