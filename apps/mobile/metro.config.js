const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = {
  projectRoot,
  watchFolders: [
    workspaceRoot,
    path.resolve(workspaceRoot, 'packages/shared'),
  ],

  resolver: {
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,

    nodeModulesPaths: [
      path.join(projectRoot, 'node_modules'),
      path.join(workspaceRoot, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
