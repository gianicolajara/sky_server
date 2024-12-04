/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.ts"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@routes/(.*)$": "<rootDir>/src/routes/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@schemas/(.*)$": "<rootDir>/src/schemas/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
  },
  preset: "ts-jest",
  testTimeout: 30000,
};
