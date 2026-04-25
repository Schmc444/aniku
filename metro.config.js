const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// 🔧 Configuración para Firebase
// Agregar soporte para archivos .cjs que usa Firebase
defaultConfig.resolver.sourceExts.push("cjs");

// 🔧 Configuración adicional para React Native Web (opcional)
defaultConfig.resolver.platforms = ["ios", "android", "native", "web"];

module.exports = defaultConfig;
