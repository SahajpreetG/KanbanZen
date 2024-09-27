// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["cloud.appwrite.io", "appwrite.io"], 
    },
    webpack(config) {
        // Add support for importing SVGs as React components
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },
};

export default nextConfig;

