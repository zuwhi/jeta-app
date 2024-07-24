import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

const pwaConfig = withPWA({
  dest: "public",
});

export default {
  ...nextConfig,
  ...pwaConfig,
};
