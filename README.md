# Blog generator with Next.js

Monorepo for blog generator, rich text editor

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a static site generator app for blog with [Next.js](https://nextjs.org/)
- `wysiwyg`: a WYSIWYG html editor app for blog contents with [Next.js](https://nextjs.org/)
- `@repo/content`: a blog content library shared by both `web` and `wysiwyg` applications
- `@repo/ui`: a React component library shared by both `web` and `wysiwyg` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/tailwind-config`: `tailwindcss` configurations

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```sh
yarn build
```

### Develop

To develop all apps and packages, run the following command:

```sh
yarn dev
```

## Deploy

```sh
yarn deploy
```

