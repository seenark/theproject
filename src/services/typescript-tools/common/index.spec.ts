import { describe, expect, it } from "vitest";
import type { PackageManager } from "@services/package-manager";
import { Effect, Exit, Layer, pipe } from "effect";
import { ShellCommandFailed, ShellLayer } from "@services/shell";
import { SystemError } from "@effect/platform/Error";
import { make } from ".";

const getInstallCommandTestCases = [
  {
    pm: "npm" as PackageManager,
    expected: "npm i",
  },
  {
    pm: "pnpm" as PackageManager,
    expected: "pnpm add",
  },
  {
    pm: "yarn" as PackageManager,
    expected: "yarn add",
  },
  {
    pm: "bun" as PackageManager,
    expected: "bun add",
  },
];

const getUninstallCommandTestCases = [
  {
    pm: "npm" as PackageManager,
    expected: "npm uninstall",
  },
  {
    pm: "pnpm" as PackageManager,
    expected: "pnpm remove",
  },
  {
    pm: "yarn" as PackageManager,
    expected: "yarn remove",
  },
  {
    pm: "bun" as PackageManager,
    expected: "bun remove",
  },
];

const errorResult = SystemError({
  reason: "AlreadyExists",
  pathOrDescriptor: "",
  module: "FileSystem",
  method: "",
  message: "",
});

const installViaExecaTestCases = [
  {
    pm: "npm" as PackageManager,
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
    expected: undefined,
  },
  {
    pm: "pnpm" as PackageManager,
    success: false,
    expected: errorResult,
  },
  {
    pm: "yarn" as PackageManager,
    success: true,
    expected: undefined,
  },
  {
    pm: "yarn" as PackageManager,
    success: false,
    expected: errorResult,
  },
  {
    pm: "bun" as PackageManager,
    success: true,
    expected: undefined,
  },
  {
    pm: "bun" as PackageManager,
    success: false,
    expected: errorResult,
  },
];

describe("typescript tools common service", () => {
  it.each(getInstallCommandTestCases)("get install command using $pm", ({ pm, expected }) => {
    const cmd = make.getInstallCommand(pm);
    expect(cmd).toBe(expected);
  });

  it.each(getUninstallCommandTestCases)("get uninstall command using $pm", ({ pm, expected }) => {
    const cmd = make.getUnInstallCommand(pm);
    expect(cmd).toBe(expected);
  });

  it.each(installViaExecaTestCases)("do command using $pm via execa", async ({ pm, expected, success }) => {
    const shellLayerTest = Layer.succeed(ShellLayer, ShellLayer.of({
      execa: () => success ? Effect.succeed(expected) : Effect.fail(ShellCommandFailed.new("cmd")(expected)),
    }));

    const exit = await pipe(
      make.install(pm),
      Effect.provide(shellLayerTest),
      Effect.runPromiseExit,
    );

    if (success) {
      expect(exit).toEqual(Exit.succeed(expected));
    } else {
      expect(exit).toEqual(Exit.fail(ShellCommandFailed.new("cmd")(expected)));
    }
  });
});
