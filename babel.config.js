module.exports = function (api) {
  api.cache(true);

  const plugins = [];

  if (process.env.NODE_ENV === "production") {
    plugins.push("transform-remove-console");
  }

  // Reanimated debe ir al final de la lista de plugins.
  plugins.push("react-native-reanimated/plugin");

  return {
    presets: ["babel-preset-expo"],
    plugins,
  };
};
