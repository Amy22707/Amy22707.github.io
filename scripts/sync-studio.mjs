import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { syncStudio, git, githubRemote, shouldSyncPush, inspectGitPush, cleanGitEnvironment } from './studio-sync-core.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  if (process.env.AMY_STUDIO_SYNC_ACTIVE === '1') process.exit(0);
  const hook = process.argv.includes('--pre-push');
  const args = process.argv.slice(2);
  if (!hook && (!args.length || args.includes('--help'))) {
    console.log('Use --check (read-only) or --all (synchronize Studio, then push homepage main).');
    process.exit(0);
  }
  if (!hook && args.some(arg => !['--check', '--all', '--dry-run', '-n'].includes(arg))) throw new Error('Unknown option. Use --check or --all.');
  if (hook) {
    const remote = process.argv.at(-1);
    if (!githubRemote(remote || '', 'Amy22707.github.io')) process.exit(0);
    const updates = readFileSync(0, 'utf8');
    if (!shouldSyncPush(updates, git(root, ['branch', '--show-current']).stdout.trim())) process.exit(0);
    const intent = inspectGitPush();
    if (!intent) throw new Error('Could not verify Git push intent. Use npm.cmd run push:all, or run npm.cmd run studio:check to inspect changes without publishing.');
    if (intent.dryRun) { console.log('Homepage dry-run: Studio will not be committed or pushed.'); process.exit(0); }
  }
  const check = args.includes('--check') || args.includes('--dry-run') || args.includes('-n');
  if (process.argv.includes('--all')) {
    if (!githubRemote(git(root, ['remote', 'get-url', 'origin']).stdout.trim(), 'Amy22707.github.io')) throw new Error('Homepage origin is not the expected repository.');
    if (git(root, ['branch', '--show-current']).stdout.trim() !== 'main') throw new Error('Homepage is not on main. Switch it manually before publishing.');
  }
  syncStudio({ root, check });
  if (process.argv.includes('--all') && !check) {
    git(root, ['push', 'origin', 'main'], { env: { ...cleanGitEnvironment(), AMY_STUDIO_SYNC_ACTIVE: '1' } });
    console.log('Homepage synchronized.');
  }
} catch (error) { console.error('[Studio sync] ' + error.message); process.exitCode = 1; }
