# Website languages

The language selector has three modes:

- **默认 / Default** restores the original website: mostly English interfaces and Chinese posts.
- **全中文** switches interface and introduction text to Chinese.
- **English** switches Chinese article text and game introductions to English.

The choice is saved locally under `amy.site-language`. The personal website, Studio, and the game introduction share it when hosted on the same `amy22707.github.io` origin. Previews on different ports do not share browser storage.

## What stays unchanged

- Friends' names and descriptions in Links (`translate="no"`).
- PDF/PPT attachments, images, source Markdown, code blocks, inline code, and mathematical formulas.
- Link destinations, heading IDs, downloaded filenames, and copied friend-link snippets.
- Account names and technology/product names where appropriate.

Only visible page text, titles, descriptions, and accessibility labels are translated. The original content remains the default and can always be restored using the selector. English translations begin as machine-generated drafts, with manual corrections for terminology, names, and context; they should not be treated as an independently verified technical reference.

## Files

- `public/i18n/runtime.js`: browser language switcher; no visitor text is sent to a translation service.
- `public/i18n/language.css`: language control and responsive typography.
- `public/i18n/site.json`, `pages.json`, `pages/*.json`: generated static dictionaries; commit these with the website.
- `src/i18n/overrides.json`: manually checked shared translations, keyed by the original text.
- `src/i18n/page-overrides.json`: contextual corrections for a specific HTML route. This avoids changing the meaning of short fragments everywhere.
- `.studio-workspace/i18n/`: ignored local inventory and translation cache. Do not publish these caches.
- `.studio-workspace/amy-studio/site/i18n/`: Studio's separate copy of the runtime and its own dictionaries. Commit these in the Studio repository, not only in the personal-site repository.

## Updating translations after editing content

Run from `D:\PKU\CODE\my-homepage` with Node.js available:

```powershell
npm.cmd run build
node scripts/collect-i18n.mjs
```

The collector reads rendered HTML, skipping protected content. Add or correct translations in the two override files. Existing dictionaries remain usable even without the ignored caches; for a fresh checkout, regenerate the local inventory and obtain drafts only if new translations are needed.

The optional draft generator is **not** part of `npm run build` or deployment:

```powershell
pwsh -File scripts/translate-i18n.ps1
```

It sends pending, unprotected text to Bing Translator. Only run it when you consent to sending that text. It does not use personal credentials and does not store the public translation session token. Completed cache entries and shared manual overrides are reused. The public endpoint may be rate-limited or change; if it fails, keep the existing dictionaries and supply manual overrides rather than blocking deployment.

After reviewing any new drafts:

```powershell
node scripts/build-i18n.mjs
npm.cmd run build
node scripts/check-i18n.mjs
```

Then build Studio from its own repository:

```powershell
cd .studio-workspace/amy-studio
node scripts/build.mjs
```

Normal builds and GitHub Actions use the committed static dictionaries and never contact the translation service. Publishing requires pushing the relevant changes in **both repositories**; building locally alone does not update the online sites.

## Travel Frog availability

The introduction page is `/studio/travel-frog/` in the personal-site repository. The Studio card is configured in Studio's `site/data/studio.json`. Download and play URLs are deliberately empty while testing is pending. Language changes do not publish private game packages, enable gameplay, or translate the game client itself.
