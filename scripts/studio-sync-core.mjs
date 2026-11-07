import { spawnSync } from 'node:child_process';
import { existsSync, lstatSync, realpathSync, readFileSync } from 'node:fs';
import { resolve, relative, isAbsolute, basename } from 'node:path';

export function cleanGitEnvironment(environment = process.env) {
  const env = { ...environment };
  for (const key of Object.keys(env)) if (/^GIT_(?:DIR|WORK_TREE|INDEX_FILE|COMMON_DIR|PREFIX|OBJECT_DIRECTORY|ALTERNATE_OBJECT_DIRECTORIES|CONFIG|CONFIG_PARAMETERS|CONFIG_COUNT|CONFIG_KEY_\d+|CONFIG_VALUE_\d+|QUARANTINE_PATH|IMPLICIT_WORK_TREE|GRAFT_FILE|SHALLOW_FILE|REPLACE_REF_BASE|NO_REPLACE_OBJECTS|INTERNAL_SUPER_PREFIX)$/.test(key)) delete env[key];
  return env;
}

export function githubRemote(value, repository) {
  try {
    const url = new URL(value.replace(/^git@github\.com:/i, 'ssh://git@github.com/'));
    return ['github.com', 'ssh.github.com'].includes(url.hostname.toLowerCase()) && ['https:', 'ssh:'].includes(url.protocol)
      && decodeURIComponent(url.pathname).replace(/^\/+|\.git\/?$|\/$/gi, '').toLowerCase() === `amy22707/${repository}`.toLowerCase();
  } catch { return false; }
}

export function shouldSyncPush(input, branch) {
  const lines = input.trim().split('\n').filter(Boolean);
  if (!lines.length) return branch === 'main';
  return lines.some(line => { const [, local, remote] = line.trim().split(/\s+/); return remote === 'refs/heads/main' && local && !/^0+$/.test(local); });
}

export function allowedStudioPath(path) {
  if (!path || path.includes('\\') || isAbsolute(path) || path.split('/').includes('..')) return false;
  if (/\.(?:exe|msi|apk|aab|ipa|dmg|pkg|zip|7z|rar|tar|gz|frogsave|jsonl|wasm|pt|pth|onnx)$/i.test(path)) return false;
  if (/(^|\/)(?:\.env(?:\..*)?|downloads?|releases?|saves?|user-data|backups?|captures?|node_modules|dist)(\/|$)/i.test(path)) return false;
  return ['README.md', 'package.json', 'package-lock.json', '.gitignore', 'scripts/build.mjs', 'scripts/serve.mjs', 'site/index.html', 'site/styles.css', 'site/app.js', 'site/favicon.svg'].includes(path)
    || path === 'site/download-mirror.css'
    || /^site\/focusbloom\/(?:index\.html|features\.css|screenshots\/[^/]+\.(?:png|jpe?g|webp))$/i.test(path)
    || /^site\/jizhi\/(?:index\.html|guide\.(?:css|js))$/.test(path)
    || /^site\/notes\/(?:article\.css|travel-frog\/index\.html)$/.test(path)
    || /^\.github\/workflows\/[^/]+\.ya?ml$/.test(path)
    || /^site\/(?:data\/.*\.json|i18n\/.*\.(?:json|js|mjs|css)|images\/.*\.(?:png|jpe?g|webp|svg|gif|ico|avif))$/i.test(path);
}

export function parseStatus(output) {
  const chunks = output.split('\0'), paths = [];
  for (let i = 0; i < chunks.length; i++) {
    if (!chunks[i]) continue;
    const status = chunks[i].slice(0, 2); paths.push(chunks[i].slice(3));
    if (/[RC]/.test(status) && chunks[i + 1]) paths.push(chunks[++i]);
  }
  return [...new Set(paths)];
}

export function git(cwd, args, { env = cleanGitEnvironment(), allowFailure = false } = {}) {
  const result = spawnSync('git', ['-C', cwd, ...args], { env, encoding: 'utf8', windowsHide: true, maxBuffer: 12 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0 && !allowFailure) throw new Error(`Git ${args[0]} failed.\n${(result.stderr || result.stdout).replace(/(https?:\/\/)[^\s/@]+(?::[^\s/@]*)?@/g, '$1[redacted]@')}`);
  return result;
}

export function inspectGitPush() {
  // Git does not pass --dry-run to hooks. Inspect only our own parent chain and
  // fail closed if push intent cannot be determined; never print command lines.
  if (process.platform === 'win32') {
    const script = `$current=${process.ppid}; $items=@(); for($i=0;$i -lt 10 -and $current -gt 0;$i++){ $p=Get-CimInstance Win32_Process -Filter ("ProcessId="+$current); if(-not $p){break}; $items+=@{name=$p.Name;command=$p.CommandLine}; $current=$p.ParentProcessId }; ConvertTo-Json -InputObject @($items) -Compress`;
    const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], { encoding: 'utf8', windowsHide: true, timeout: 15000 });
    if (result.status !== 0) return null;
    try {
      const chain = JSON.parse(result.stdout.replace(/^\uFEFF/, ''));
      const parent = chain.find(item => /^git(?:\.exe)?$/i.test(item.name));
      if (!parent?.command || !/(?:^|\s)push(?:\s|$)/.test(parent.command)) return null;
      return { dryRun: /(?:^|[\s"])(?:--dry-run|-[A-Za-z]*n[A-Za-z]*)(?=$|[\s"])/.test(parent.command) };
    } catch { return null; }
  }
  if (process.platform === 'linux') {
    let pid = process.ppid;
    for (let i = 0; i < 10 && pid > 1; i++) {
      try {
        const args = readFileSync(`/proc/${pid}/cmdline`, 'utf8').split('\0').filter(Boolean);
        if (/^git$/.test(basename(args[0] || '')) && args.includes('push')) return { dryRun: args.some(arg => arg === '--dry-run' || /^-[A-Za-z]*n[A-Za-z]*$/.test(arg)) };
        pid = Number(readFileSync(`/proc/${pid}/stat`, 'utf8').match(/\)\s+\S+\s+(\d+)/)?.[1]);
      } catch { return null; }
    }
  }
  return null;
}

export function syncStudio({ root, check = false, validateRemote = value => githubRemote(value, 'amy-studio'), log = console.log }) {
  const base = realpathSync(root), directory = resolve(base, '.studio-workspace/amy-studio');
  if (!existsSync(directory)) throw new Error('Studio checkout is missing at .studio-workspace/amy-studio. Clone the independent Studio repository there first.');
  const studio = realpathSync(directory), inside = relative(base, studio);
  if (inside.startsWith('..') || isAbsolute(inside)) throw new Error('Studio checkout must stay inside the homepage workspace.');
  if (resolve(git(studio, ['rev-parse', '--show-toplevel']).stdout.trim()) !== studio) throw new Error('Studio must be an independent Git repository.');
  if (git(studio, ['branch', '--show-current']).stdout.trim() !== 'main') throw new Error('Studio is not on main. Switch it manually before publishing.');
  if (!validateRemote(git(studio, ['remote', 'get-url', 'origin']).stdout.trim())) throw new Error('Studio origin does not match the expected Amy22707/amy-studio repository.');
  const paths = parseStatus(git(studio, ['status', '--porcelain=v1', '-z', '--untracked-files=all']).stdout);
  let bytes = 0;
  for (const path of paths) {
    if (!allowedStudioPath(path)) throw new Error(`Not auto-publishing this non-website file: ${path}`);
    const full = resolve(studio, path);
    if (existsSync(full)) {
      const actual = relative(studio, realpathSync(full));
      if (actual.startsWith('..') || isAbsolute(actual)) throw new Error(`Website asset points outside Studio: ${path}`);
      const stat = lstatSync(full);
      if (stat.isSymbolicLink() || stat.size > 10 * 1024 * 1024) throw new Error(`Unsupported symlink or oversized website asset: ${path}`);
      bytes += stat.size;
    }
  }
  if (paths.length > 500 || bytes > 20 * 1024 * 1024) throw new Error('Studio changes are unusually large. Review them manually before publishing.');
  if (paths.length && git(studio, ['var', 'GIT_AUTHOR_IDENT'], { allowFailure: true }).status !== 0) throw new Error('Configure Git user.name and user.email for Studio before automatic commits.');
  if (check) { log(`Studio check passed: ${paths.length} website files would be committed. Nothing was changed or pushed.`); return { changed: paths.length, committed: false, pushed: false }; }

  git(studio, ['fetch', '--no-tags', 'origin', 'main']);
  if (git(studio, ['merge-base', '--is-ancestor', 'refs/remotes/origin/main', 'HEAD'], { allowFailure: true }).status !== 0) throw new Error('Studio remote has newer or divergent commits. Pull/reconcile it manually; synchronization never force-pushes.');
  const outgoing = git(studio, ['rev-list', 'refs/remotes/origin/main..HEAD']).stdout.trim().split('\n').filter(Boolean);
  for (const commit of outgoing) {
    const files = git(studio, ['diff-tree', '--root', '--no-commit-id', '--name-only', '-r', '-z', commit]).stdout.split('\0').filter(Boolean);
    for (const path of files) if (!allowedStudioPath(path)) throw new Error(`An unpushed Studio commit contains a non-website file: ${path}`);
  }
  if (!paths.length && !outgoing.length) { log('Studio is already up to date.'); return { changed: 0, committed: false, pushed: false }; }
  const build = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: studio, env: cleanGitEnvironment(), encoding: 'utf8', windowsHide: true, maxBuffer: 2 * 1024 * 1024 });
  if (build.error || build.status !== 0) throw new Error(`Studio build failed; nothing was committed or pushed.\n${build.stderr || build.error?.message || build.stdout}`);
  if (paths.length) {
    // Literal pathspecs and argv arrays preserve spaces/Unicode and avoid shell expansion.
    git(studio, ['--literal-pathspecs', 'add', '--all', '--', ...paths]);
    git(studio, ['commit', '-m', 'chore: sync Studio with personal homepage']);
    log(`Committed ${paths.length} Studio website files.`);
  }
  git(studio, ['push', 'origin', 'HEAD:refs/heads/main']);
  log('Studio synchronized. Continuing the homepage push.');
  return { changed: paths.length, committed: paths.length > 0, pushed: true };
}
