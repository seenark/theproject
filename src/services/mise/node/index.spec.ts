import { ExecaFailed, ShellLayer } from "@services/shell";
import { Effect, Exit, Layer, pipe } from "effect";
import { describe, expect, it, vi } from "vitest";
import { createMiseNode } from ".";

const testCases = [
  {
    desc: "undefined (succeed)",
    expected: Effect.succeed(undefined),
  },
  {
    desc: "ExecaFailed (failed)",
    expected: Effect.fail(ExecaFailed.new("echo")("error: failed")),
  },
];

describe("mise node service", () => {
  it.each(testCases)("should return $desc when command run", async ({ expected }) => {
    const mockShellLayer = {
      execa: () => Effect.succeed(expected),
    };
    const shellLayerTest = Layer.succeed(ShellLayer, ShellLayer.of(mockShellLayer));

    const exit = await pipe(
      createMiseNode,
      Effect.provide(shellLayerTest),
      Effect.runPromiseExit,
    );

    expect(exit).toEqual(Exit.succeed(expected));
  });
});
