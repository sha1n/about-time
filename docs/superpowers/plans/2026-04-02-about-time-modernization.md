# about-time Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade dependencies for `about-time` to latest versions, resolve 24 vulnerabilities, and modernize tooling.

**Architecture:** Block-by-block migration strategy: Infrastructure -> Jest -> ESLint Flat Config.

**Tech Stack:** TypeScript 5, Jest 29, ESLint 10 (Flat Config), pnpm.

---

### Task 1: TypeScript & Infrastructure Upgrade

**Files:**
- Modify: `../about-time/package.json`
- Modify: `../about-time/tsconfig.json`

- [ ] **Step 1: Update package.json core dev deps**

Update `package.json` with latest versions for core tools.
```json
"devDependencies": {
  "@types/chance": "^1.1.6",
  "@types/is-ci": "^3.0.4",
  "@types/node": "^22.13.5",
  "chance": "^1.1.12",
  "is-ci": "^4.1.0",
  "prettier": "^3.5.2",
  "ts-node": "^10.9.2",
  "typescript": "^5.7.3"
}
```

- [ ] **Step 2: Fix tsconfig.json deprecations**

Update `tsconfig.json` with `moduleResolution: "node10"` and `ignoreDeprecations: "5.0"`.

- [ ] **Step 3: Run pnpm install and build**

Run: `cd ../about-time && pnpm install && pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit changes**

```bash
git add package.json tsconfig.json pnpm-lock.yaml
git commit -m "chore: upgrade typescript and core infra"
```

---

### Task 2: Jest Modernization (v29)

**Files:**
- Modify: `../about-time/package.json`
- Modify: `../about-time/jest.config.ts`

- [ ] **Step 1: Update package.json with Jest 29 deps**

```json
"devDependencies": {
  "@types/jest": "^29.5.14",
  "jest": "^29.7.0",
  "jest-environment-node": "^29.7.0",
  "jest-extended": "^6.0.0",
  "jest-html-reporters": "^3.1.7",
  "jest-mock-extended": "^4.0.0",
  "jest-summary-reporter": "^0.0.2",
  "ts-jest": "^29.2.6"
}
```

- [ ] **Step 2: Modernize jest.config.ts**

Update `jest.config.ts` using `dagraph` patterns.
```typescript
import isCI from 'is-ci';

const reporters = ['default', ['jest-summary-reporter', { failuresOnly: true }]];

if (!isCI) {
  reporters.push(['jest-html-reporters', { failuresOnly: false }]);
}

export default {
  testMatch: ['**/test/**/*.spec.ts'],
  coveragePathIgnorePatterns: ['test/*', 'dist/*'],
  reporters,
  verbose: true,
  maxWorkers: isCI ? '2' : '100%',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
  slowTestThreshold: 1.5 * 1000,
  testTimeout: 10 * 1000,
  setupFilesAfterEnv: ['jest-extended/all']
};
```

- [ ] **Step 3: Verify tests**

Run: `cd ../about-time && pnpm jest`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add package.json jest.config.ts pnpm-lock.yaml
git commit -m "chore: upgrade jest to v29"
```

---

### Task 3: ESLint v10 Migration (Flat Config)

**Files:**
- Modify: `../about-time/package.json`
- Create: `../about-time/eslint.config.mjs`
- Delete: `../about-time/.eslintrc.js`

- [ ] **Step 1: Update package.json with ESLint 10 deps**

```json
"devDependencies": {
  "@eslint/js": "^9.21.0",
  "eslint": "^9.21.0",
  "eslint-config-prettier": "^10.0.2",
  "eslint-plugin-import": "^2.31.0",
  "eslint-plugin-jest": "^28.11.0",
  "eslint-plugin-no-floating-promise": "^2.0.0",
  "eslint-plugin-prettier": "^5.2.3",
  "eslint-plugin-unused-imports": "^4.1.4",
  "globals": "^16.0.0",
  "typescript-eslint": "^8.24.1"
}
```

- [ ] **Step 2: Create eslint.config.mjs**

Use `dagraph`'s `eslint.config.mjs` as template, tailored for `about-time`.

- [ ] **Step 3: Cleanup and verify lint**

Run: `cd ../about-time && rm .eslintrc.js && pnpm lint`
Expected: SUCCESS

- [ ] **Step 4: Commit changes**

```bash
git add package.json eslint.config.mjs pnpm-lock.yaml
git rm .eslintrc.js
git commit -m "chore: migrate to eslint v10 flat config"
```

---

### Task 4: Release and Final Audit

- [ ] **Step 1: Final Audit**

Run: `cd ../about-time && pnpm audit`
Expected: 0 vulnerabilities found.

- [ ] **Step 2: Prepare for release**

Update version in `package.json` to `1.0.0` or similar (ask user for version if unsure, but for plan let's say bump minor).

- [ ] **Step 3: Build and Commit**

Run: `pnpm build`
Commit final changes.
