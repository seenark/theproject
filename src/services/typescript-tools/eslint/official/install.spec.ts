import { describe, expect, it } from "vitest";
import type { PackageManager } from "@services/package-manager";
import { Effect, Exit, Layer, pipe } from "effect";
import { SystemError } from "@effect/platform/Error";
import { ShellLayer } from "@services/shell";
import { getInstallCommand, installUsingPackageManager } from "./install";

const getInstallCommandTestCases = [
  {
    pm: "npm" as PackageManager,
    expected: "npm init @eslint/config@latest",
  },
  {
    pm: "pnpm" as PackageManager,
    expected: "pnpm create @eslint/config@latest",
  },
  {
    pm: "yarn" as PackageManager,
    expected: "yarn create @eslint/config",
  },
  {
    pm: "bun" as PackageManager,
    expected: "bun create @eslint/config@latest",
  },
];

const errorResult = SystemError({
  reason: "AlreadyExists",
  pathOrDescriptor: "",
  module: "FileSystem",
  method: "",
  message: "",
});
const installTestCases = [
  {
    pm: "npm" as PackageManager,
    success: true,
    expected: undefined,
  },
  {
    pm: "pnpm" as PackageManager,
    success: true,
    expected: undefined,
  },
  {
    pm: "yarn" as PackageManager,
    success: true,
    expected: undefined,
  },
  {
    pm: "bun" as PackageManager,
    success: true,
    expected: undefined,
  },
  {
    pm: "npm" as PackageManager,
    success: false,
    expected: errorResult,
  },
  {
    pm: "pnpm" as PackageManager,
    success: true,
    expected: errorResult,
  },
  {
    pm: "yarn" as PackageManager,
    success: true,
    expected: errorResult,
  },
  {
    pm: "bun" as PackageManager,
    success: true,
    expected: errorResult,
  },
];

describe("eslint offical installation", () => {
  it.each(getInstallCommandTestCases)("get install command using $pm", ({ pm, expected }) => {
    const cmd = getInstallCommand(pm);
    expect(cmd).toBe(expected);
  });

  it.each(installTestCases)("install using $pm", async ({ pm, success, expected }) => {
    const shellLayerTest = Layer.succeed(ShellLayer, ShellLayer.of({
      execa: () => success ? Effect.succeed(expected) : Effect.fail(ShellLayer.ExecaFailed("cmd")(expected)),
    }));

    const exit = await pipe(
      installUsingPackageManager(pm),
      Effect.provide(shellLayerTest),
      Effect.runPromiseExit,
    );

    if (success) {
      expect(exit).toEqual(Exit.succeed(expected));
    } else {
      expect(exit).toEqual(Exit.fail(ShellLayer.ExecaFailed("cmd")(expected)));
    }
  });
});
