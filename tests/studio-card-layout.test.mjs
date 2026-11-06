import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const studio = new URL('../.studio-workspace/amy-studio/site/', import.meta.url);

test('Studio actions remain outside optional card content', async () => {
  const source = await readFile(new URL('app.js', studio), 'utf8');
  assert.match(source, /node\.append\(artwork\(project\),\s*copy,\s*actions\)/);
  assert.doesNotMatch(source, /copy\.append\(actions\)/);
});

test('Studio cards share footer tracks rather than optional-notice spacers', async () => {
  const css = await readFile(new URL('styles.css', studio), 'utf8');
  assert.match(css, /@supports\s*\(grid-template-rows:\s*subgrid\)\s*\{\s*\.project-card\s*\{[^}]*grid-template-rows:\s*subgrid;[^}]*grid-row:\s*span 3;/);
  assert.doesNotMatch(css, /\.project-copy\s*>\s*\.project-actions\s*\{/);
  const notices = [...css.matchAll(/[^{}]*\.project-notice\s*\{([^}]*)\}/g)];
  for (const [, declarations] of notices) assert.doesNotMatch(declarations, /margin(?:-top)?:[^;]*auto/);
});
