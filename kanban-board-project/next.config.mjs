// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["cloud.appwrite.io", "appwrite.io", "links.papareact.com", "your-image-domain.com"], // Add any other required domains
    },
    experimental: {
        appDir: true, // Ensure experimental features are enabled if used
    },
};

export default nextConfig;
