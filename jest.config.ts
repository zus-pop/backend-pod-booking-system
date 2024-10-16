/** @type {import('jest').Config} */
const config: import("jest").Config = {
    verbose: true,
    setupFiles: ["dotenv/config"],
    transform: {
        "^.+\\.(t|j)sx?$": "babel-jest",
    }
};

module.exports = config;
