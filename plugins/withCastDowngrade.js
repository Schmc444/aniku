const { withProjectBuildGradle } = require('@expo/config-plugins');

const CAST_VERSION = '22.2.0';
const MARKER = `play-services-cast-framework:${CAST_VERSION}`;

module.exports = function withCastDowngrade(config) {
  return withProjectBuildGradle(config, (mod) => {
    if (mod.modResults.contents.includes(MARKER)) {
      return mod;
    }
    // Insert a second allprojects block before expo-root-project.
    // Multiple allprojects blocks are valid Gradle and merge cleanly.
    mod.modResults.contents = mod.modResults.contents.replace(
      'apply plugin: "expo-root-project"',
      `allprojects {
  configurations.all {
    resolutionStrategy.force 'com.google.android.gms:play-services-cast-framework:${CAST_VERSION}'
  }
}

apply plugin: "expo-root-project"`
    );
    return mod;
  });
};
