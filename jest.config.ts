import isCI from 'is-ci';

const reporters: any[] = ['default', ['jest-summary-reporter', { failuresOnly: true }]];

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
