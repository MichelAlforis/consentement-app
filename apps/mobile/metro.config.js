const path = require('path');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getSentryExpoConfig(projectRoot);

// Watch the monorepo so Metro sees changes in packages/ while preserving Expo defaults.
config.watchFolders = [...new Set([...(config.watchFolders ?? []), monorepoRoot])];

// Resolve modules from both the app and the monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// pnpm uses symlinks — Metro must follow them to reach the virtual store
config.resolver.unstable_enableSymlinks = true;

// Force React + React Native to always resolve from the app — prevents dual-instance
// hook crashes when packages/core or its deps (zustand) import React indirectly.
// react-native-purchases listed explicitly because pnpm symlinks aren't always followed
// by Metro's initial resolver (unstable_enableSymlinks covers watching, not cold resolution).
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  three: path.resolve(projectRoot, 'node_modules/three'),
  'react-native-purchases': path.resolve(projectRoot, 'node_modules/react-native-purchases'),
};

// PNG + standard assets
config.resolver.assetExts = [...config.resolver.assetExts, 'png', 'jpg', 'jpeg', 'gif', 'webp'];

module.exports = config;