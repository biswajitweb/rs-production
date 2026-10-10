
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    // React app is deployed at /staging/
    base: "/staging/",

    server: {
        open: true,

        proxy: {
            "/api": {
                target:
                    "https://rabisankar.com/staging/rswordpress/wp-json",
                changeOrigin: true,
                secure: true,

                // /api/custom-store/v1/products
                // becomes /custom-store/v1/products
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
