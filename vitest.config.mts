import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// Unit tests for pure logic (price maths, nav state, formatting, view-state parsing).
// No DOM environment: component tests would need Testing Library, which isn't approved.
export default defineConfig({
  // Mirrors tsconfig's "@/*" → "./src/*"
  resolve: { alias: { "@": resolve(import.meta.dirname, "src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
