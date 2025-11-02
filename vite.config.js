import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174, // 👈 change this to whatever port you want
    open: true, // optional: auto-open browser
    host: true, // optional: listen on all network interfaces
  },
});
