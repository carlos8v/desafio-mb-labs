import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['./src/domain/**/*.spec.ts'],
    exclude: ['./src/application', './src/infra', 'node_modules'],
    alias: {
      '@application': resolve(__dirname, 'src/application'),
      '@domain': resolve(__dirname, 'src/domain'),
      "@tests": resolve(__dirname, 'tests')
    }
  }
})
