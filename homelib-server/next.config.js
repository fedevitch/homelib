/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    mode: "development"
  },
  i18n: {
    locales: ['ua', 'en'],
    defaultLocale: 'ua'
  }
}

module.exports = nextConfig
