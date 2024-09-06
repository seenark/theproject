import { FileSystem } from "@effect/platform/FileSystem";
import { config } from "@templates/typescript-tools/biome/biome.json";
import { Effect } from "effect";

export const createBiomeJson = Effect.all({
  fs: FileSystem,
  config: Effect.succeed(config),
}).pipe(
  Effect.flatMap(({ config, fs }) => fs.writeFileString("biome.json", JSON.stringify(config, null, 2))),
);
