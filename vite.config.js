import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    server: {
        open: true,

        proxy: {
            "/api": {
                target: "https://rabisankar.com/staging/wp-json",
                changeOrigin: true,
                secure: true,

                rewrite: (path) =>
                    path.replace(/^\/api/, ""),
            },
        },
    },
});