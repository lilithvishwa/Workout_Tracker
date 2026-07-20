import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "convolutional-celibatic-shu.ngrok-free.dev",
      "https://dorine-bolographic-apparently.ngrok-free.dev",
    ],
    port: 5173,
    host: true, // allows access from your phone over local network, e.g. http://<your-laptop-ip>:5173
  },
});
