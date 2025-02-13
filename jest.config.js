/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'jest-environment-jsdom',
    testEnvironmentOptions: {
        customExportConditions: ['react-native'],
    },
    testMatch: [
        '**/tests/**/*.test.js'
    ],
};

module.exports = config;
