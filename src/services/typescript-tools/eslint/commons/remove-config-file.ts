import { Effect } from "effect";
import { FsLayer } from "@services/fs";
import { configFiles } from "../official/uninstall";

export function removeAllEslintConfigFile() {
  return Effect.all({
    fs: FsLayer,
  }).pipe(
    Effect.flatMap(({ fs }) =>
      Effect.forEach(configFiles, f => fs.removeFileIfExist(f), { concurrency: "unbounded" }),
    ),
  );
}
