// The host may run npm pack with NODE_ENV=development (for example Bun's .env).
// Always build distributable artifacts in production mode, independent of the caller.
process.env.NODE_ENV = 'production';
const { build } = await import('vite');
await build({
  configFile: process.argv.includes('--demo') ? 'vite.demo.config.ts' : 'vite.config.ts',
});
