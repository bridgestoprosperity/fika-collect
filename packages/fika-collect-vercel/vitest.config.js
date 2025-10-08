/// <reference types="vitest" />
import { defineConfig } from "vite";

// Configure tests of Vercel functions. Endpoint implementations live in
// api/, tests live in tests/.
export default defineConfig({
  test: {
    exclude: []
  },
});
