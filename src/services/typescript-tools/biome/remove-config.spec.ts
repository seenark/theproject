import { describe, it } from "vitest";
import { Effect, Exit, Layer, pipe } from "effect";
import { FileSystem } from "@effect/platform/FileSystem";
import { PlatformErrorTypeId, SystemError, isPlatformError } from "@effect/platform/Error";
import { FsLayer } from "@services/fs";
import { removeBiomeJson } from "./remove-config";

describe("biome remove config", () => {
  it("should return undefined when remove biome.json successfully", async ({ expect }) => {
    const fileSystemLayerTest = Layer.succeed(FileSystem, FileSystem.of({
      exists: () => Effect.succeed(true),
      remove: (_path: string) => Effect.void,
      // eslint-disable-next-line ts/no-explicit-any
    } as any,
    ));

    const fsLayerTest = Layer.succeed(FsLayer, FsLayer.of({
      removeFileIfExist: () => Effect.void,
    }));

    const layerTest = Layer.mergeAll(fileSystemLayerTest, fsLayerTest);

    const exit = await pipe(
      removeBiomeJson,
      Effect.provide(layerTest),
      Effect.runPromiseExit,
    );

    expect(exit).toEqual(Exit.succeed(undefined));
  });

  it("should return PlatformError when remove biome.json failed", async ({ expect }) => {
    const result = SystemError({
      reason: "AlreadyExists",
      pathOrDescriptor: "",
      module: "FileSystem",
      method: "",
      message: "",
    });
    const fileSystemLayerTest = Layer.succeed(FileSystem, FileSystem.of({
      exists: () => Effect.succeed(true),
      remove: (_path: string) => Effect.fail(result),
      // eslint-disable-next-line ts/no-explicit-any
    } as any,
    ));

    const fsLayerTest = Layer.succeed(FsLayer, FsLayer.of({
      removeFileIfExist: () => Effect.fail(result),
    }));

    const layerTest = Layer.mergeAll(fileSystemLayerTest, fsLayerTest);

    const exit = await pipe(
      removeBiomeJson,
      Effect.provide(layerTest),
      Effect.runPromiseExit,
    );

    expect(exit).toEqual(Exit.fail(result));
  });
});
