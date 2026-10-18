import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, mkdirSync, readFileSync, renameSync } from 'node:fs';

const registry = 'https://registry.npmjs.org';
const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const versionPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const command = process.argv[2];
assert.match(manifest.version, versionPattern);
assert.equal(manifest.name, '@kci-lnk/gp-ui');
const distTag = manifest.version.includes('-') ? 'next' : 'latest';
const artifact = '.release/package.tgz';

function validate() {
  assert.equal(process.env.GITHUB_REF_TYPE, 'tag', 'Publishing requires a Git tag');
  assert.equal(process.env.GITHUB_REF_NAME, `v${manifest.version}`, 'Tag must match package.json');
  assert.equal(process.env.GITHUB_REPOSITORY, 'kci-lnk/gp-ui');
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  assert.equal(lock.version, manifest.version);
  assert.equal(lock.packages[''].version, manifest.version);
  execFileSync('git', ['merge-base', '--is-ancestor', 'HEAD', 'origin/main']);
  console.log(`Validated ${manifest.name}@${manifest.version} on main; npm dist-tag: ${distTag}`);
}

async function publishedVersion() {
  const response = await fetch(
    `${registry}/${encodeURIComponent(manifest.name)}/${manifest.version}`,
    {
      signal: AbortSignal.timeout(30000),
    },
  );
  if (response.status === 404) return null;
  assert.ok(response.ok, `Registry lookup failed: ${response.status}`);
  return response.json();
}

if (command === 'validate') {
  validate();
} else if (command === 'pack') {
  mkdirSync('.release', { recursive: true });
  const [packed] = JSON.parse(
    execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', '.release'], {
      encoding: 'utf8',
    }),
  );
  assert.equal(packed.name, manifest.name);
  assert.equal(packed.version, manifest.version);
  renameSync(`.release/${packed.filename}`, artifact);
  console.log(`Packed ${manifest.name}@${manifest.version}: ${artifact}`);
} else if (command === 'publish') {
  validate();
  const integrity = `sha512-${createHash('sha512').update(readFileSync(artifact)).digest('base64')}`;
  const existing = await publishedVersion();
  if (existing) {
    assert.equal(
      existing.dist.integrity,
      integrity,
      'Version already exists with different contents; bump version',
    );
    console.log('Identical version is already published; no duplicate publish needed.');
  } else {
    execFileSync(
      'npm',
      [
        'publish',
        artifact,
        '--ignore-scripts',
        '--access',
        'public',
        '--tag',
        distTag,
        `--registry=${registry}`,
      ],
      { stdio: 'inherit' },
    );
    let published;
    const deadline = Date.now() + 10 * 60 * 1000;
    while (Date.now() < deadline) {
      published = await publishedVersion();
      if (published) break;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    assert.equal(
      published?.dist?.integrity,
      integrity,
      'Registry integrity differs from verified artifact',
    );
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `Published or verified **${manifest.name}@${manifest.version}**\n\nhttps://www.npmjs.com/package/${manifest.name}/v/${manifest.version}\n\nIntegrity: \`${integrity}\`\n`,
    );
  }
} else {
  throw new Error('Usage: node scripts/release.mjs validate|pack|publish');
}
