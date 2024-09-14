import { Context, Effect, Layer } from "effect";
import { FileSystem } from "@effect/platform/FileSystem";

export function removeFileIfExist(filename: string) {
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

export const make = {
  removeFileIfExist,
};

export class FsLayer extends Context.Tag("services/fs")<FsLayer, typeof make>() {
  static Live = Layer.succeed(this, this.of(make));
}
