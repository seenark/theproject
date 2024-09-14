import { FileSystem } from "@effect/platform/FileSystem";
import { Effect, Exit, Layer, pipe } from "effect";
import { describe, expect, it, vi } from "vitest";
import { config } from "@templates/typescript-tools/biome/biome.json";
import { SystemError } from "@effect/platform/Error";
import { createBiomeJson } from "./custom-config";

const testCases = [
  {
    desc: "undefined (successfully)",
    mockReturn: Effect.succeed(undefined),
    expected: Exit.succeed(undefined),
  },
  {
    desc: "PlatformError (failed)",
    mockReturn: Effect.fail(SystemError({
      reason: "Busy",
      pathOrDescriptor: "path or descriptor",
      module: "Clipboard",
      method: "",
      message: "",
    })),
    expected: Exit.fail(SystemError({
      reason: "Busy",
      pathOrDescriptor: "path or descriptor",
      module: "Clipboard",
      method: "",
      message: "",
    })),
  },
];

describe("biome custom config", async () => {
  it.each(testCases)("should return $desc when write biome.json failed", async ({ mockReturn, expected }) => {
    const fileSystemTest = Layer.succeed(FileSystem, FileSystem.of({
      writeFileString: () => mockReturn,
      // eslint-disable-next-line ts/no-explicit-any
    } as unknown as any));

    const exit = await pipe(
      createBiomeJson,
      Effect.provide(fileSystemTest),
      Effect.runPromiseExit,
    );

    expect(exit).toEqual(expected);
  });
});
