# Dovolenkátor

Malá SPA aplikace na vytváření a správu dovolených

## Features

- **Zaměstnanec** role: může vytvořit, upravit, nebo zrušit žádost od dovolenou, nebo sick day
- **Admin** role: může zobrazit, schválit, nebo zamítnout všechny žádosti o dovolené

## Tech Stack

- [Vue 3](https://vuejs.org/) + Composition API
- [TypeScript](https://www.typescriptlang.org/)
- [Vuetify 4](https://vuetifyjs.com/) — UI component library
- [Vue Router 5](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/) — state management
- [vee-validate](https://vee-validate.logaretm.com/) + [yup](https://github.com/jquense/yup) — form validation
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
