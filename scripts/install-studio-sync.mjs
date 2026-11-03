import { resolve, dirname, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile, mkdir, chmod, lstat } from 'node:fs/promises';
import { git, githubRemote } from './studio-sync-core.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const marker = '# amy-homepage-studio-sync managed entry point';
try {
  if (!githubRemote(git(root, ['remote', 'get-url', 'origin']).stdout.trim(), 'Amy22707.github.io')) throw new Error('Install this hook only in the personal homepage repository.');
  const configured = git(root, ['config', '--get', 'core.hooksPath'], { allowFailure: true }).stdout.trim();
  if (configured) throw new Error('An existing core.hooksPath is configured. It was not changed; chain this hook manually or use npm.cmd run push:all.');
  const hooks = resolve(root, git(root, ['rev-parse', '--git-path', 'hooks']).stdout.trim());
  const within = relative(root, hooks);
  if (within.startsWith('..') || isAbsolute(within)) throw new Error('Hook directory is outside this workspace. Install manually; no external metadata was changed.');
  const destination = resolve(hooks, 'pre-push');
  let previous = '';
  try { if ((await lstat(destination)).isSymbolicLink()) throw new Error('Refusing to overwrite a symlinked pre-push hook.'); previous = await readFile(destination, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (previous && !previous.includes(marker)) throw new Error('A pre-push hook already exists. It was not overwritten; chain the tracked .githooks/pre-push manually.');
  const content = '#!/bin/sh\n' + marker + '\nrepo_root="$(git rev-parse --show-toplevel)" || exit 1\nexec sh "$repo_root/.githooks/pre-push" "$@"\n';
  await mkdir(hooks, { recursive: true });
  await writeFile(destination, content, { mode: 0o755 });
  await chmod(destination, 0o755);
  console.log('Studio pre-push synchronization installed. Existing post-commit/post-checkout hooks were preserved. No commits or pushes were made.');
} catch(error) { console.error(error.message); process.exitCode=1; }
