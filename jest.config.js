/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/+(*.)+(spec).+(ts)"],
  moduleFileExtensions: ["ts", "html", "js", "json"],
  transform: {
    "^.+\\.(ts|js|html)$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.spec.json",
      stringifyContentPathRegex: "\\.html$",
    },
  },
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
