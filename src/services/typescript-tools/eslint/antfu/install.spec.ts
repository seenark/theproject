import type { PackageManager } from "@services/package-manager";
import { describe, expect, expectTypeOf, it } from "vitest";
import { Effect, Exit, Layer, pipe } from "effect";
import { ExecaFailed, ShellLayer } from "@services/shell";
import { base } from "./constants";
import { getInstallCommand, install } from "./install";

const getInstallCommandsTestCases = [
  {
    pm: "npm" as PackageManager,
    expected: `npx ${base}@latest` as const,
  },
  {
    pm: "pnpm" as PackageManager,
    expected: `pnpm dlx ${base}@latest` as const,
  },
  {
    pm: "yarn" as PackageManager,
    expected: `yarn ${base}@latest` as const,
  },
  {
    pm: "bun" as PackageManager,
    expected: `bunx ${base}@latest` as const,
  },
];

const installCommandsTestCases = [
  {
    pm: "npm" as PackageManager,
    expected: undefined,
  },
  {
    pm: "pnpm" as PackageManager,
    expected: undefined,
  },
  {
    pm: "yarn" as PackageManager,
    expected: undefined,
  },
  {
    pm: "bun" as PackageManager,
    expected: undefined,
  },
];

const failedInstallCommandsTestCases = [
  {
    pm: "npm" as PackageManager,
    expected: ExecaFailed.new("cmd")("error"),
  },
  {
    pm: "pnpm" as PackageManager,
    expected: ExecaFailed.new("cmd")("error"),
  },
  {
    pm: "yarn" as PackageManager,
    expected: ExecaFailed.new("cmd")("error"),
  },
  {
    pm: "bun" as PackageManager,
    expected: ExecaFailed.new("cmd")("error"),
  },
];

describe("eslint Antfu config install commands", () => {
  it.each(getInstallCommandsTestCases)("should return install command for $pm", ({ pm, expected }) => {
    const cmd = getInstallCommand(pm);
    expect(cmd).toBe(expected);
  });

  it.each(installCommandsTestCases)("should return void(undefined) command for $pm", async ({ pm, expected }) => {
    const shellLayerTest = Layer.succeed(ShellLayer, ShellLayer.of({
      execa: () => Effect.void,
    }));

    const exit = await pipe(
      install(pm),
      Effect.provide(shellLayerTest),
      Effect.runPromiseExit,
    );

    expect(exit).toEqual(Exit.succeed(expected));
  });

  it.each(failedInstallCommandsTestCases)("should return Failed command for $pm", async ({ pm, expected }) => {
    const shellLayerTest = Layer.succeed(ShellLayer, ShellLayer.of({
      execa: () => Effect.fail(expected),
    }));

    const exit = await pipe(
      install(pm),
      Effect.provide(shellLayerTest),
      Effect.runPromiseExit,
    );

    expect(exit).toEqual(Exit.fail(expected));
  });
});
