const path = require("path");

module.exports = {
  resolver: {
    // Ensure symlinked modules resolve correctly
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => path.resolve(__dirname, "node_modules", name),
      }
    ),
  },
  watchFolders: [
    // Add the absolute path to the symlinked module
    path.resolve(__dirname, "../path-to-symlinked-module"),
  ],
};
