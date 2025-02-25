/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.pexels.com",
      "images.unsplash.com",
      "upload.wikimedia.org",
      "via.placeholder.com",
    ],
  },
  env: {
    NEXT_PUBLIC_PEXELS_API_KEY: process.env.NEXT_PUBLIC_PEXELS_API_KEY,
  },
};

module.exports = nextConfig;
