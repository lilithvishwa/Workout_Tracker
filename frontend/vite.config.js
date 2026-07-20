import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // allows access from your phone over local network, e.g. http://<your-laptop-ip>:5173
  },
});
