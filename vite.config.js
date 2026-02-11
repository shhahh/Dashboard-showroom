import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // <--- Ye line honi chahiye

export default defineConfig({
  plugins: [react(), tailwindcss()], // <--- Ye dono plugins hone chahiye
});