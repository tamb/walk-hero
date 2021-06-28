var exec = require("child_process").execSync;

module.exports = class ESLintClearPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.watchRun.tap("ESLintClearPlugin", () => {
      console.log("cache delete");
      exec("del .eslintcache");
      exec(" rm -rf node_modules/.cache/eslint-loader");
    });
  }
};
