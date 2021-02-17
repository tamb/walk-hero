const path = require("path");
module.exports = {
  webpack: {
    alias: {
      "@components": path.resolve(__dirname, "src/components/"),
      "@data": path.resolve(__dirname, "src/data/"),
      "@gif": path.resolve(__dirname, "src/gif/"),
      "@modals": path.resolve(__dirname, "src/modals"),
      '@root': path.resolve(__dirname),
      "@services": path.resolve(__dirname, "src/services/"),
      "@store": path.resolve(__dirname, "src/store/"),
      "@utils": path.resolve(__dirname, "src/utils/"),
      "@views": path.resolve(__dirname, "src/views/"),
      "@workers": path.resolve(__dirname, "src/workers/"),
    },
  },
};
