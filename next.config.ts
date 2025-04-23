import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["placecats.com"], // ⬅️ agrega aquí el dominio externo
  },
};

module.exports = nextConfig;


export default nextConfig;
