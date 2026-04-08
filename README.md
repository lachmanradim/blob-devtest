# blob-devtest

Dovolenkátor by: Radim Lachman

## Tech Stack

- [Vue 3](https://vuejs.org/) + Composition API
- [TypeScript](https://www.typescriptlang.org/)
- [Vuetify 4](https://vuetifyjs.com/) — UI component library
- [Vue Router 5](https://router.vuejs.org/)
- [Vite 8](https://vitejs.dev/) — build tool
- [SCSS](https://sass-lang.com/)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)

## Requirements

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/)

## Setup

```bash
pnpm install
```

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `pnpm dev`        | Start development server            |
| `pnpm build`      | Type-check and build for production |
| `pnpm preview`    | Preview production build locally    |
| `pnpm type-check` | Run TypeScript type checking        |
| `pnpm lint`       | Lint all files                      |
| `pnpm lint:fix`   | Lint and auto-fix all files         |
| `pnpm format`     | Format source files with Prettier   |

## Project Structure

```
src/
├── main.ts          # App entry point
├── App.vue          # Root component
├── router/
│   └── index.ts     # Vue Router configuration
├── styles/
│   ├── main.scss    # Global styles
│   └── settings.scss # Vuetify SCSS variable overrides
└── views/
    └── HomeView.vue # Home page
```
