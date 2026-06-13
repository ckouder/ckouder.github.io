# Bingji Guo — Portfolio

Art portfolio and artist statement. Plain, function-first SvelteKit site, fully prerendered.

## Editing content

- **Works** — edit `src/lib/content.ts`. Each work is one entry; a commented template is at the bottom of the `works` array.
- **Images** — put files in `static/works/<slug>/` and reference them as `/works/<slug>/<file>` with alt text.
- **Artist statement** — edit `src/routes/statement/+page.svelte` (plain paragraphs).
- **Bio / contact** — edit `src/routes/about/+page.svelte` and the `contact` object in `src/lib/content.ts`.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build (static, via adapter-vercel)
npm run preview      # serve the production build
npm test             # unit tests (content validation)
npm run test:integration  # playwright smoke tests
npm run check        # type checking
```
