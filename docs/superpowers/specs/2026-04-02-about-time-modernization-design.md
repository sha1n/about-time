# Design Doc: Dependency Modernization for about-time

This document outlines the plan to upgrade all dependencies in the `about-time` repository to their latest major versions, resolving 24 security vulnerabilities (mostly transitives from older `eslint` and `ts-jest` dependencies) and fixing TypeScript deprecations.

## Goals

1.  **Resolve Security Vulnerabilities:** Fix all vulnerabilities reported by `pnpm audit`.
2.  **Fix TypeScript Deprecations:** Resolve the `moduleResolution: node` deprecation error in TypeScript 5+.
3.  **Modernize Tooling:** Upgrade ESLint (v8 -> v9/v10) to the flat config standard, update Jest configurations, and bump core dependencies like `typescript`, `prettier`, etc.

## Approach

We will use an incremental block upgrade strategy, identical to the one used for the `pipelines` repository.

### Block 1: TypeScript & Infrastructure Upgrade
- **Action:** Bump `typescript`, `ts-node`, `prettier`, and types.
- **Config:** Update `tsconfig.json` to use `"moduleResolution": "node10"` and `"ignoreDeprecations": "5.0"`.
- **Verification:** Run `pnpm install && pnpm run build`.

### Block 2: Jest Configuration Modernization
- **Action:** Bump Jest dependencies (`jest`, `ts-jest`, `@types/jest`, reporters, etc.) to their latest stable versions.
- **Config:** Update `jest.config.ts` to use the modern array-based transform config for `ts-jest`, moving away from the deprecated string preset.
- **Verification:** Run `pnpm jest`.

### Block 3: ESLint v10 Migration (Flat Config)
- **Action:** Upgrade ESLint and all plugins to v9+.
- **Migration:** Convert `.eslintrc.js` to the new Flat Config system (`eslint.config.mjs`).
- **Verification:** Run `pnpm lint`.

### Final Steps
- **Audit:** Run `pnpm audit` to ensure all vulnerabilities are cleared.
- **Test:** Run the full `pnpm test` suite.
- **Commit:** Prepare for release.