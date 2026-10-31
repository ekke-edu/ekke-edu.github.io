# EKKE-EDU homepage

The organization homepage is a bilingual React and TypeScript application built with Vite. Course cards and translations live in `src/content.ts`; interactive sections are composed in `src/App.tsx` and `src/components`.

## Local development

```sh
npm install
npm run dev
```

Run the checks and production build:

```sh
npm test
npm run build
npm run preview
```

The static production bundle is written to `dist/`. GitHub Actions builds and deploys that directory to GitHub Pages when changes reach `main`.

The embedded EKKE assistant uses the public chat service. MCP configuration is displayed on the site so students and developers can connect their own MCP-compatible client.
