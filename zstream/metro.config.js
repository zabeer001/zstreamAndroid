const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
const defaultBlockList = config.resolver.blockList;

config.resolver.blockList = [
  ...(Array.isArray(defaultBlockList) ? defaultBlockList : [defaultBlockList].filter(Boolean)),
  /(^|\/)\.git\.inner-backup(\/.*)?$/,
  /android\/\.gradle\/.*/,
  /android\/build\/.*/,
  /android\/app\/build\/.*/,
  /android\/app\/\.cxx\/.*/,
];

module.exports = withNativeWind(config, { input: './global.css' });
