import { mkdtempSync, readFileSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const packageName = manifest.name;
const packTemp = mkdtempSync(join(tmpdir(), 'gp-ui-pack-'));
const temp = mkdtempSync(join(tmpdir(), 'gp-ui-consumer-'));
let server, browser;
try {
  let archive;
  if (process.argv[2]) {
    archive = resolve(process.argv[2]);
    assert.ok(existsSync(archive), `Archive not found: ${archive}`);
  } else {
    execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });
    const [packed] = JSON.parse(
      execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', packTemp], {
        cwd: root,
        encoding: 'utf8',
      }),
    );
    archive = join(packTemp, packed.filename);
  }
  const publishOutput = JSON.parse(
    execFileSync(
      'npm',
      [
        'publish',
        archive,
        '--dry-run',
        '--ignore-scripts',
        '--json',
        '--access',
        'public',
        '--registry=https://registry.npmjs.org/',
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    ),
  );
  // npm 10 returns one record; npm 11 keys records by package name.
  const packed = publishOutput[packageName] ?? publishOutput;
  assert.equal(packed.name, packageName);
  assert.equal(packed.version, manifest.version);
  for (const file of packed.files) {
    assert.match(
      file.path,
      /^(dist\/|docs\/|README\.md$|LICENSE$|CHANGELOG\.md$|CONTRIBUTING\.md$|package\.json$)/,
    );
  }
  const dev = manifest.devDependencies;
  writeFileSync(
    join(temp, 'package.json'),
    JSON.stringify({
      name: 'gp-ui-consumer-smoke',
      private: true,
      type: 'module',
      scripts: { build: 'vue-tsc --noEmit && vite build' },
      dependencies: { [packageName]: 'file:' + archive, vue: dev.vue },
      devDependencies: {
        vite: dev.vite,
        '@vitejs/plugin-vue': dev['@vitejs/plugin-vue'],
        'vue-tsc': dev['vue-tsc'],
        typescript: dev.typescript,
      },
    }),
  );
  cpSync(join(root, 'playground'), join(temp, 'playground'), { recursive: true });
  for (const name of ['App.vue', 'Showcase.vue']) {
    const path = join(temp, 'playground', name);
    writeFileSync(
      path,
      readFileSync(path, 'utf8').replaceAll("from '../src'", `from '${packageName}'`),
    );
  }
  const main = join(temp, 'playground/main.ts');
  writeFileSync(
    main,
    `import '${packageName}/style.css';\n` +
      readFileSync(main, 'utf8').replace("import '../src/style.css';\n", ''),
  );
  cpSync(join(root, 'index.html'), join(temp, 'index.html'));
  writeFileSync(
    join(temp, 'vite.config.ts'),
    "import {defineConfig} from 'vite';import vue from '@vitejs/plugin-vue';export default defineConfig({plugins:[vue()]});",
  );
  writeFileSync(
    join(temp, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        strict: true,
        skipLibCheck: false,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        types: ['vite/client'],
      },
      include: ['playground'],
    }),
  );
  execFileSync('npm', ['install', '--ignore-scripts'], { cwd: temp, stdio: 'inherit' });
  const installedRoot = join(temp, 'node_modules', packageName);
  const installed = JSON.parse(readFileSync(join(installedRoot, 'package.json'), 'utf8'));
  assert.equal(installed.name, packageName);
  assert.equal(installed.version, manifest.version);
  assert.equal(installed.license, 'MIT');
  assert.notEqual(installed.private, true);
  for (const version of Object.values({
    ...installed.dependencies,
    ...installed.peerDependencies,
  })) {
    assert.doesNotMatch(version, /^(workspace:|file:|link:|\/|[A-Z]:\\)/);
  }
  for (const entry of [
    installed.exports['.'].import,
    installed.exports['.'].types,
    installed.exports['./style.css'],
  ]) {
    assert.ok(existsSync(join(installedRoot, entry)), `Missing export: ${entry}`);
  }
  const bundle = readFileSync(join(installedRoot, 'dist/gp-ui.js'), 'utf8');
  assert.doesNotMatch(bundle, /@growatt\/|\/Users\/|\/home\/|[A-Z]:\\/);
  assert.doesNotMatch(bundle, /__file/);
  execFileSync('npm', ['run', 'build'], { cwd: temp, stdio: 'inherit' });
  server = spawn(
    process.execPath,
    [
      join(temp, 'node_modules/vite/bin/vite.js'),
      'preview',
      '--host',
      '127.0.0.1',
      '--port',
      '5191',
      '--strictPort',
    ],
    { cwd: temp, stdio: 'ignore' },
  );
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch('http://127.0.0.1:5191')).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  browser = await chromium.launch({
    channel: process.env.CI ? undefined : 'chrome',
    headless: true,
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://127.0.0.1:5191');
  const preview = page.locator('.themed-preview');
  assert.equal(
    await preview
      .getByRole('button', { name: 'Primary', exact: true })
      .evaluate((e) => getComputedStyle(e).backgroundColor),
    'rgb(8, 127, 140)',
  );
  await preview.getByLabel('Name', { exact: true }).fill('Packed consumer');
  assert.match(await preview.locator('.readout').innerText(), /Packed consumer/);
  await preview.getByRole('button', { name: 'Open dialog', exact: true }).click();
  await page.getByRole('dialog', { name: 'Example dialog' }).waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog', { name: 'Example dialog' }).waitFor({ state: 'hidden' });
  assert.equal(
    await preview
      .getByRole('button', { name: 'Open dialog', exact: true })
      .evaluate((e) => document.activeElement === e),
    true,
  );
  assert.deepEqual(errors, []);
  console.log(
    'Packed consumer: strict types, production build, CSS theme, input, dialog and focus passed.',
  );
} finally {
  await browser?.close();
  server?.kill();
  rmSync(temp, { recursive: true, force: true });
  rmSync(packTemp, { recursive: true, force: true });
}
