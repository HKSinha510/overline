#!/bin/bash
# Patch React Native Gradle plugin ktfmtCheck issue
# This is a known issue with RN 0.84 where tasks.named is used instead of tasks.register

GRADLE_FILE="node_modules/@react-native/gradle-plugin/build.gradle.kts"

if [ -f "$GRADLE_FILE" ]; then
  sed -i '' 's/tasks.named("ktfmtCheck")/tasks.register("ktfmtCheck")/' "$GRADLE_FILE"
  sed -i '' 's/tasks.named("ktfmtFormat")/tasks.register("ktfmtFormat")/' "$GRADLE_FILE"
  echo "✅ Patched @react-native/gradle-plugin ktfmt tasks"
fi
