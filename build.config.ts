import { fileURLToPath } from "node:url";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index.ts"],
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: "node18",
      minify: true,
    },
  },
  /*
    alias should match alias in tsconfig
    this setting will tell rollup how to resolve paths
  */
  alias: {
    "@templates": fileURLToPath(new URL("./src/templates/", import.meta.url)),
    "@libs": fileURLToPath(new URL("./src/libs/", import.meta.url)),
    "@services": fileURLToPath(new URL("./src/services/", import.meta.url)),
    "@cmd": fileURLToPath(new URL("./src/commands/", import.meta.url)),
    "@prompts": fileURLToPath(new URL("./src/prompts/", import.meta.url)),
  },
});
