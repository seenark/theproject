import { describe, expect, it } from "vitest";
import { Effect, Exit, pipe } from "effect";
import { FileSystemLayerTest } from "@test/helpers/FileSystem";
import { removeFileIfExist } from ".";

describe("fs layer", async () => {
  it("should return undefined when remove file", async () => {
    const exit = await pipe(
      removeFileIfExist("test.json"),
      Effect.provide(FileSystemLayerTest.succeed),
      Effect.runPromiseExit,
    );
    expect(exit).toEqual(Exit.succeed(undefined));
  });

  it("should return failed when remove file", async () => {
    const exit = await pipe(
      removeFileIfExist("test.json"),
      Effect.provide(FileSystemLayerTest.failed),
      Effect.runPromiseExit,
    );
    expect(exit).toEqual(Exit.fail(FileSystemLayerTest.systemError));
  });
});
