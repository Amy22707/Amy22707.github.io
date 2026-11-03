# One push for the homepage and Studio

Studio remains an independent Git repository at
`.studio-workspace/amy-studio` inside your homepage checkout. It is intentionally ignored
by the personal homepage repository. A local pre-push hook synchronizes its website
source whenever you push the homepage's `main` branch to its normal GitHub remote.

## One-time setup

```powershell
npm.cmd run setup:studio-sync
```

The installer creates only `.git/hooks/pre-push`, which delegates to the tracked
`.githooks/pre-push`. It does not change `core.hooksPath` or replace existing
post-commit/post-checkout hooks. If a different pre-push hook or custom hooks path
already exists, installation stops rather than overwriting it. Each new clone needs
this setup once and needs the separate Studio checkout in the location above.

## Normal use

Commit your homepage changes as usual, then run `git push`. Studio's current website
changes will be checked, built, automatically committed, and pushed first. Its own
GitHub Pages workflow then deploys it. You do not need a second Studio push.

This means a homepage push also authorizes publishing the current Studio website
edits, including edits not previously staged. It does **not** automatically commit
the homepage itself: commit homepage changes before pushing, just as before.

Allowed files include Studio's README/package files, its build and preview scripts,
workflow definitions, the existing site entry files, translation dictionaries, data
JSON, and images. Installers, private saves, captures, game-runtime folders, symlinks,
unrelated files, and unusually large batches are not auto-published. Installers and
private runtime folders are also ignored in Studio's `.gitignore`. Already tracked
or committed unsafe files are still checked; removing an installer in a later commit
does not make its earlier unpublished Git history safe to push.

The hook never force-pushes, merges, rebases, or discards changes. A failed Studio
build, unexpected files, or remote divergence stops the homepage push with an error.
Reconcile the reported problem manually and retry. Studio and homepage pushes are
not a distributed atomic transaction: if Studio succeeds but the later homepage
push fails, Studio stays published; fix/retry the homepage push rather than rewriting
Studio history.

## Read-only check and fallback command

```powershell
npm.cmd run studio:check
```

This checks local Studio files without staging, committing, fetching, building, or
pushing. A normal Git `--dry-run` is detected from the calling Git process and does
not auto-commit or push Studio. If push intent cannot be determined, the hook stops
instead of guessing. Windows Git and Linux are supported for automatic detection.

If hooks are unavailable (for example on another machine), after committing the
homepage run this explicit one-command alternative:

```powershell
npm.cmd run push:all
```

It performs the same Studio checks and synchronization, then pushes homepage `main`
without recursively invoking Studio synchronization again. You can test the logic
without using either real GitHub repository:

```powershell
npm.cmd run test:studio-sync
```

These integration tests use disposable local worktrees and local bare remotes only.

# Project dates and pins

The Projects page and tag pages split entries into Projects and Course Notes. In
each section, pinned entries come first; normal entries are ordered by `publishedAt`,
newest first. Equal dates use the content ID for stable ordering. Entries without
a date go last: no creation/publication dates are invented for existing entries.

Add these fields to a project's Markdown frontmatter:

```yaml
publishedAt: 2026-11-03
updatedAt: 2026-11-03
pinned: true
pinOrder: 1
```

`publishedAt` is the entry's publication/reference date, not its update date or file
modification time. `updatedAt` is display-only and never changes ordering. Existing
`date` fields remain supported as a legacy publication-date fallback. ISO timestamps
are also accepted; dates are displayed in the Asia/Shanghai time zone. Initial dates
follow GitHub repository creation (`created_at`) and latest code-push (`pushed_at`)
timestamps. By default, these GitHub dates are used for every
project and course-note entry. Repository creation is a reference date,
not proof of the current project's first release or the date a private repository
became public. In particular, reusing an older repository for a rebuilt website
does not make the repository's creation date that website's publication date.

Refresh all entry dates from GitHub with one command, then commit/push normally:

```powershell
npm.cmd run sync:project-dates
```

Use `npm.cmd run sync:project-dates -- --check` for a read-only preview. This uses
the existing GitHub login to read private repositories; credentials are never printed
or saved. Dates are saved in Beijing calendar time. Only `publishedAt` and `updatedAt`
are replaced; descriptions, version-history notes, pins, and other metadata stay intact.
The command makes no commits or pushes and is not run automatically during a build.

For an explicitly chosen publication date, add `preservePublishedAt: true` next to
`publishedAt: YYYY-MM-DD`. Synchronization then keeps that publication date while
still refreshing `updatedAt` from GitHub. Fundamentals of Artificial Intelligence
uses this exception for its publication date of 2026-07-08.

Pinned entries with smaller `pinOrder` values appear earlier. The default is
100, so `pinned: true` alone works, and adding `pinOrder: 1`, `2`, etc. lets you arrange
chosen cards like GitHub pins. All entries are unpinned by default; remove `pinned`
or set it to false to return an entry to date ordering.

Blog Markdown supports the same `pinned` and `pinOrder` fields. Unpinned posts still
sort by `publishedAt`, not `updatedAt`. Pinning applies to the Blog/Projects lists
and tag lists; it does not change article dates, chronological Previous/Next links,
homepage Recent Writing, or homepage selected projects. `featured` controls the
highlight badge and homepage priority, not date ordering in the Projects list.

The homepage's current selected projects are FocusBloom and Travel Frog. The IDs
are listed in `homepageProjectIds` in `src/pages/index.astro`; `featured` chooses
their badge and display priority. Other project entries remain in the full list.

# Publications and presentations

Edit `src/data/publications.ts`. Write `authors` as an array in the original
authorship order; the site never rearranges authors. Names listed in
`ownerAuthorNames` are shown in bold automatically on the homepage and Publications
page. A trailing `*`, `†`, or `‡` may be included without losing the name highlight.

```ts
authors: ["First Author", "Zhiyao Xue", "Third Author"],
conference: "Conference name",
journal: "Journal name",
awards: ["Award name"],
```

The conference, journal, and awards fields are optional and shown only when provided.
Conference and journal are separate rows when both exist. Papers
belong in `publications`; slides, posters and competition presentations belong in
`presentations`. Keep their actual status and do not label a competition presentation
as an accepted conference paper. The Mahjong competition award is recorded with its
presentation, rather than repeated in the homepage's general honors list.
