import { Effect } from "effect";
import { FsLayer } from "@services/fs";
import { biomeJsonPath } from "./const";

export const removeBiomeJson = Effect.all({
  fs: FsLayer,
}).pipe(
  Effect.flatMap(({ fs }) => {
    return fs.removeFileIfExist(biomeJsonPath);
  }),
);
