import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignora erros de tipo durante o build (mas ainda mostra warnings)
    ignoreBuildErrors: false,
  },
  // Desabilita typedRoutes para evitar conflitos com NextAuth
  typedRoutes: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'izmzxqzcsnaykofpcjjh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Configura qualidades permitidas
    qualities: [85, 100],
  },
};

export default nextConfig;
