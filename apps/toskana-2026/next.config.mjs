/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Nur lokale Bilder aus /public/images — bewusst keine Remote-Patterns,
    // damit keine externen Bild-URLs brechen können.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 750, 828, 1080, 1200, 1440, 1920, 2560],
    imageSizes: [64, 96, 128, 256, 384, 512],
  },
};

export default nextConfig;
