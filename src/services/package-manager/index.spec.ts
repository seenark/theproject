// import { Context, Layer, Match } from "effect";
//
// export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";
//
// export const getInstallCommand = Match.type<PackageManager>().pipe(
//   Match.when("bun", () => "bun add" as const),
//   Match.when("npm", () => "npm install" as const),
//   Match.when("pnpm", () => "pnpm add" as const),
//   Match.when("yarn", () => "yarn add" as const),
//   Match.exhaustive,
// );
//
// export const getUninstallCommand = Match.type<PackageManager>().pipe(
//   Match.when("bun", () => "bun remove" as const),
//   Match.when("npm", () => "npm uninstall" as const),
//   Match.when("pnpm", () => "pnpm remove" as const),
//   Match.when("yarn", () => "yarn remove" as const),
//   Match.exhaustive,
// );
//
// type PackageManagerService = {
//   getInstallCommand: typeof getInstallCommand;
//   getUninstallCommand: typeof getUninstallCommand;
// };
//
// export class PackageManagerLayer extends Context.Tag("service/PackageManagerLayer")<PackageManagerLayer, PackageManagerService>() {
//   static Live = Layer.succeed(PackageManagerLayer, {
//     getInstallCommand,
//     getUninstallCommand,
//   });
// }

import { describe, expect, it } from "vitest";
import { type PackageManager, getInstallCommand, getUninstallCommand } from ".";

const installTestCases = [
  {
    input: "bun" as PackageManager,
    expected: "bun add" as ReturnType<typeof getInstallCommand>,
  },
  {
    input: "npm" as PackageManager,
    expected: "npm install" as ReturnType<typeof getInstallCommand>,
  },
  {
    input: "pnpm" as PackageManager,
    expected: "pnpm add" as ReturnType<typeof getInstallCommand>,
  },
  {
    input: "yarn" as PackageManager,
    expected: "yarn add" as ReturnType<typeof getInstallCommand>,
  },
];

const uninstallTestCases = [
  {
    input: "bun" as PackageManager,
    expected: "bun remove" as ReturnType<typeof getInstallCommand>,
  },
  {
    input: "npm" as PackageManager,
    expected: "npm uninstall" as ReturnType<typeof getInstallCommand>,
  },
  {
    input: "pnpm" as PackageManager,
    expected: "pnpm remove" as ReturnType<typeof getInstallCommand>,
  },
  {
    input: "yarn" as PackageManager,
    expected: "yarn remove" as ReturnType<typeof getInstallCommand>,
  },
];

describe("node/bun package manager command", () => {
  it.each(installTestCases)("should return $expected for $input package manager", async ({ input, expected }) => {
    const res = getInstallCommand(input);
    expect(res).toBe(expected);
  });

  it.each(uninstallTestCases)("should return $expected for $input package manager", async ({ input, expected }) => {
    const res = getUninstallCommand(input);
    expect(res).toBe(expected);
  });
});
