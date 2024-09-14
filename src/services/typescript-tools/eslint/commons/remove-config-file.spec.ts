import { FsLayer } from "@services/fs";
import { Effect, Exit, Layer, pipe } from "effect";
import { describe, expect, it } from "vitest";
import { FileSystemLayerTest } from "@test/helpers/FileSystem";
import { removeAllEslintConfigFile } from "./remove-config-file";

describe("eslint common  should return array of undefined when remove all eslint config files", () => {
  it("remove eslint config files successfully", async () => {
    const fsLayerTest = Layer.succeed(FsLayer, FsLayer.of({
      removeFileIfExist: () => Effect.void,
    }));

    const exit = await pipe(
      removeAllEslintConfigFile(),
      Effect.provide(fsLayerTest),
      Effect.provide(FileSystemLayerTest.succeed),
      Effect.runPromiseExit,
    );

    const isArray = Exit.match(exit, {
      onSuccess: a => Array.isArray(a),
      onFailure: () => false,
    });

    expect(isArray).toBeTruthy();
  });

  it("should failed when remove eslint config files failed", async () => {
    const fsLayerTest = Layer.succeed(FsLayer, FsLayer.of({
      removeFileIfExist: () => Effect.fail(FileSystemLayerTest.systemError),
    }));

    const exit = await pipe(
      removeAllEslintConfigFile(),
      Effect.provide(fsLayerTest),
      Effect.provide(FileSystemLayerTest.succeed),
      Effect.runPromiseExit,
    );

    expect(Exit.isFailure(exit)).toBeTruthy();
  });
});
