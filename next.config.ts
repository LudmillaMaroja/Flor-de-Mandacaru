// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // gera site estático em ./out para o GitHub Pages
  output: "export",

  // se um dia usar <Image />, evita otimização no build estático do Pages
  images: { unoptimized: true },

  // como seu repositório NÃO é teooodbs.github.io, precisa do basePath
  basePath: "/Flor-de-Mandacaru",
  assetPrefix: "/Flor-de-Mandacaru/",

  // ajuda o Pages a servir /pasta/index.html
  trailingSlash: true,

    env: {
    NEXT_PUBLIC_BASE_PATH: "/Flor-de-Mandacaru",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
},

  };

export default nextConfig;
