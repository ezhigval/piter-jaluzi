import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * We export a static bundle that will be
   * served by the Go backend as plain files.
   * 
   * Временно отключаем для разработки с динамическими маршрутами
   */
  // output: "export",
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
