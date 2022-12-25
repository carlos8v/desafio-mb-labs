import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'prisma',
    environmentOptions: {
      adapter: 'psql',
      envFile: '.env.test'
    },
    include: [`**/*.e2e-spec.ts`],
    alias: {
      '@application': resolve(__dirname, 'src/application'),
      '@domain': resolve(__dirname, 'src/domain'),
      '@infra': resolve(__dirname, 'src/infra'),
      "@tests": resolve(__dirname, 'tests')
    }
  }
})
