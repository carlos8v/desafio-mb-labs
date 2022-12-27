import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'prisma',
    environmentOptions: {
      adapter: 'psql',
      envFile: '.env.test'
    },
    setupFiles: ['./tests/test-env.ts'],
    includeSource: ['./src/infra/**/*.spec.ts'],
    exclude: ['./src/domain', './src/application', 'node_modules'],
    alias: {
      '@application': resolve(__dirname, 'src/application'),
      '@domain': resolve(__dirname, 'src/domain'),
      '@infra': resolve(__dirname, 'src/infra'),
      "@tests": resolve(__dirname, 'tests')
    }
  }
})
