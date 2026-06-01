import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "173.249.41.92",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "test.it-klik.by",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "it-klik.by",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "test.it-klik.by",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "test.it-klik.by",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "storage.yandexcloud.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.yandexcloud.net",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
      "*.pdf": {
        type: "asset",
      },
    },
  },
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.pdf$/i,
        type: "asset/resource",
      }
    );

    return config;
  },
};

export default nextConfig;
