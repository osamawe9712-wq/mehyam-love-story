import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// عند البناء على GitHub Actions، GITHUB_REPOSITORY = "username/repo-name"
// نستخرج اسم الريبو ونضبط base عليه ليعمل النشر على GitHub Pages تحت /repo-name/
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // base يُستخدم فقط في إنتاج GitHub Pages — في التطوير يبقى "/"
  base: mode === "production" && repoName ? `/${repoName}/` : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));

