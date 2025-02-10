import { defineConfig } from "tsup";
import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";

export default defineConfig({
  entry: ["src/**/*.ts", "!src/**/*.test.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  // https://github.com/egoist/tsup/issues/953
  // https://github.com/favware/esbuild-plugin-file-path-extensions
  bundle: true,
  esbuildPlugins: [
    esbuildPluginFilePathExtensions({
      cjsExtension: "cjs",
      esmExtension: "js",
    }),
  ],
});
