import { FileSystem } from "@effect/platform/FileSystem";
import { Console, Effect } from "effect";
import { blue } from "kolorist";
import { biomeJsonPath } from "./const";

export const removeBiomeJson = Effect.all({
  fs: FileSystem,
}).pipe(
  Effect.bind("exist", ({ fs }) => fs.exists(biomeJsonPath)),
  Effect.tap(({ exist }) => Console.log(`do we found file ${blue("biome.json")}?`, exist ? "yes we do" : "no, we don't")),
  Effect.flatMap(({ fs, exist }) => {
    if (exist === false)
      return Effect.void;
    return fs.remove(biomeJsonPath);
  }),
  Effect.tap(() => Console.log(`we do remove file ${blue("biome.json")}: removed`)),
);
