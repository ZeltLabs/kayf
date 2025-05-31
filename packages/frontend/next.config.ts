import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        if (!isServer) {
            // Ensure that all imports of 'yjs' resolve to the same instance
            config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs');
        }
        return config;
    },
    reactStrictMode: false,
};

export default nextConfig;
