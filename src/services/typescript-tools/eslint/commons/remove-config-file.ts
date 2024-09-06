import { FileSystem } from "@effect/platform/FileSystem";
import { Effect } from "effect";
import { configFiles } from "../official/uninstall";

function removeConfigFile(filename: string) {
  return Effect.all({
    fs: FileSystem,
  }).pipe(
    Effect.bind("exist", ({ fs }) => fs.exists(filename)),
    Effect.flatMap(({ exist, fs }) => Effect.if(exist, {
      onFalse: () => Effect.void,
      onTrue: () => fs.remove(filename),
    })),
  );
}

export function removeAllEslintConfigFile() {
  return Effect.forEach(configFiles, f => removeConfigFile(f), { concurrency: "unbounded" });
}
