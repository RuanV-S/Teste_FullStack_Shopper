/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        port: "",
        pathname: "/maps/api/staticmap**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*", // Intercepta chamadas para /api/
        destination: process.env.PROXY_API || "http://localhost:8080/:path*", // Redireciona para o destino configurado
      },
    ];
  },
};

export default nextConfig;
