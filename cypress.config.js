const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  projectId: "ex32aq",
  e2e: {
    baseUrl: 'https://notes-serverless-app.com',
    viewportWidthBreakpoint: 768,
    defaultCommandTimeout: 10000,
    /*setupNodeEvents(on, config) {
      // implement node event listeners here
    },*/
  },
});
