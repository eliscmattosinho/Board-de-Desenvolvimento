import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command }) => ({
    base: command === "serve" ? "/" : "/development-board/",
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@context": path.resolve(__dirname, "./src/context"),
            "@features": path.resolve(__dirname, "./src/features"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@services": path.resolve(__dirname, "./src/services"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@card": path.resolve(__dirname, "./src/features/card"),
            "@board": path.resolve(__dirname, "./src/features/board"),
            "@column": path.resolve(__dirname, "./src/features/column"),
            "@pages": path.resolve(__dirname, "./src/pages"),
            "@styles": path.resolve(__dirname, "./src/styles"),
        },
    },
    server: {
        host: "localhost",
        port: 5173,
        open: true,
    },
}));
