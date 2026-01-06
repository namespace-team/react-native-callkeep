const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const escape = require('escape-string-regexp');
const pak = require('../package.json');

const peerDependencies = Object.keys(pak.peerDependencies);
const root = path.resolve(__dirname, '..');
const projectNodeModules = path.join(__dirname, 'node_modules');
const rootNodeModules = path.join(root, 'node_modules');

const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))];

// We need to make sure that only one version is loaded for peerDependencies
// So we blacklist them at the root, and alias them to the versions in example's node_modules
const blockList = peerDependencies.map(
  name => new RegExp(`^${escape(path.join(rootNodeModules, name))}\\/.*$`),
);

const extraNodeModules = peerDependencies.reduce((acc, name) => {
  acc[name] = path.join(projectNodeModules, name);
  return acc;
}, {});

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const config = {
  projectRoot: __dirname,
  watchFolders: [root],
  resolver: {
    blockList,
    extraNodeModules,
    nodeModulesPaths,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
