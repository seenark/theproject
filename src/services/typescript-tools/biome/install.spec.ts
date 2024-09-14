import { describe, expect, it } from "vitest";
import { Effect, Exit, Layer, pipe } from "effect";
import { ShellLayer } from "@services/shell";
import { getCommand, getInitCommand, getUninstallCommand, init, uninstall } from "./install";

const installCommandsTestCases = [
  {
    packageManager: "npm" as const,
    expected: "npm install --save-dev --save-exact @biomejs/biome",
  },
  {
    packageManager: "pnpm" as const,
    expected: "pnpm install --save-dev --save-exact @biomejs/biome",
  },
  {
    packageManager: "yarn" as const,
    expected: "yarn install --save-dev --save-exact @biomejs/biome",
  },
  {
    packageManager: "bun" as const,
    expected: "bun install --save-dev --save-exact @biomejs/biome",
  },
];

const initCommandTestCases = [
  {
    packageManager: "npm" as const,
    expected: "npx @biomejs/biome init",
  },
  {
    packageManager: "pnpm" as const,
    expected: "pnpm biome init",
  },
  {
    packageManager: "yarn" as const,
    expected: "yarn biome init",
  },
  {
    packageManager: "bun" as const,
    expected: "bunx biome init",
  },
];

const uninstallCommandTestCases = [
  {
    packageManager: "npm" as const,
    expected: "npm uninstall @biomejs/biome",
  },
  {
    packageManager: "pnpm" as const,
    expected: "pnpm remove @biomejs/biome",
  },
  {
    packageManager: "yarn" as const,
    expected: "yarn remove @biomejs/biome",
  },
  {
    packageManager: "bun" as const,
    expected: "bun remove @biomejs/biome",
  },
];

const initCommandInShellTestCases = [
  {
    packageManager: "npm" as const,
    expected: undefined,
  },
  {
    packageManager: "pnpm" as const,
    expected: undefined,
  },
  {
    packageManager: "yarn" as const,
    expected: undefined,
  },
  {
    packageManager: "bun" as const,
    expected: undefined,
  },
];

const uninstallCommandInShellTestCases = [
  {
    packageManager: "npm" as const,
    expected: undefined,
  },
  {
    packageManager: "pnpm" as const,
    expected: undefined,
  },
  {
    packageManager: "yarn" as const,
    expected: undefined,
  },
  {
    packageManager: "bun" as const,
    expected: undefined,
  },
];

describe("biome install functions", () => {
  it.each(installCommandsTestCases)("get biome install command using $packageManager", ({ packageManager, expected }) => {
    const cmd = getCommand(packageManager);
    expect(cmd).toBe(expected);
  });

  it.each(initCommandTestCases)("get init command using $packageManager", ({ packageManager, expected }) => {
    const cmd = getInitCommand(packageManager);
    expect(cmd).toBe(expected);
  });

  it.each(uninstallCommandTestCases)("get uninstall command using $packageManager", ({ packageManager, expected }) => {
    const cmd = getUninstallCommand(packageManager);
    expect(cmd).toBe(expected);
  });

  it.each(initCommandInShellTestCases)("get init command using $packageManager", async ({ packageManager, expected }) => {
    const shellLayerTest = Layer.succeed(ShellLayer, ShellLayer.of({
      execa: () => Effect.succeed(undefined),
    }));

    const exit = await pipe(
      init(packageManager),
      Effect.provide(shellLayerTest),
      Effect.runPromiseExit,
    );
    expect(exit).toEqual(Exit.succeed(expected));
  });

  it.each(uninstallCommandInShellTestCases)("get uninstall command using $packageManager", async ({ packageManager, expected }) => {
    const shellLayerTest = Layer.succeed(ShellLayer, ShellLayer.of({
      execa: () => Effect.succeed(undefined),
    }));

    const exit = await pipe(
      uninstall(packageManager),
      Effect.provide(shellLayerTest),
      Effect.runPromiseExit,
    );
    expect(exit).toEqual(Exit.succeed(expected));
  });
});
