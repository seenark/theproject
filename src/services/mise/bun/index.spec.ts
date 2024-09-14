import { ExecaFailed, ShellLayer } from "@services/shell";
import { Effect, Exit, Layer, pipe } from "effect";
import { describe, expect, it } from "vitest";
import { createMiseBun } from ".";

const testCases = [
  {
    description: "success case",
    expected: Effect.succeed(undefined),
  },
  {
    description: "fail case",
    expected: Effect.fail(ExecaFailed.new("echo")("error: failed")),
  },
];

describe("mise bun service", () => {
  it.each(testCases)("should return $name when command run", async ({ expected }) => {
    const shellLayerTest = Layer.succeed(ShellLayer, ShellLayer.of({
      execa: () => Effect.succeed(expected),
    }));

    const exit = await pipe(
      createMiseBun,
      Effect.provide(shellLayerTest),
      Effect.runPromiseExit,
    );

    expect(exit).toEqual(Exit.succeed(expected));
  });
});
