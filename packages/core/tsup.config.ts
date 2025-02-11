import { defineConfig, type Options } from "tsup";
import type { Plugin, PluginBuild } from "esbuild";
import fs from "node:fs";
import path from "node:path";

// https://github.com/evanw/esbuild/issues/622#issuecomment-769462611
const fixImportExtensions = (extension: string = ".js"): Plugin => ({
  name: "fix-import-extensions",
  setup(build: PluginBuild) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.importer) {
        let filePath = path.join(args.resolveDir, args.path) + ".ts";

        let resolvedPath = "";
        if (fs.existsSync(filePath)) {
          resolvedPath = args.path + extension;
        } else {
          filePath = path.join(args.resolveDir, args.path, `index.ts`);
          if (fs.existsSync(filePath)) {
            if (args.path.endsWith("/")) {
              resolvedPath = `${args.path}index${extension}`;
            } else {
              resolvedPath = `${args.path}/index${extension}`;
            }
          }
        }
        return { path: resolvedPath, external: true };
      }
    });
  },
});

const commonOptions: Options = {
  entry: ["src/**/*.ts", "!src/**/*.test.ts"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  bundle: false,
};

export default defineConfig([
  {
    ...commonOptions,
    format: "esm",
    bundle: true,
    esbuildPlugins: [fixImportExtensions()],
  },
  {
    ...commonOptions,
    format: "cjs",
  },
]);
