import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, "index.html"),
        catalogue: path.resolve(__dirname, "catalogue.html"),
        ai: path.resolve(__dirname, "ai-room-designer.html"),
        contact: path.resolve(__dirname, "contact.html"),
        admin: path.resolve(__dirname, "admin.html")
      }
    }
  }
});
