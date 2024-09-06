import { Context, Layer, Match } from "effect";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export const getInstallCommand = Match.type<PackageManager>().pipe(
  Match.when("bun", () => "bun add" as const),
  Match.when("npm", () => "npm install" as const),
  Match.when("pnpm", () => "pnpm add" as const),
  Match.when("yarn", () => "yarn add" as const),
  Match.exhaustive,
);

export const getUninstallCommand = Match.type<PackageManager>().pipe(
  Match.when("bun", () => "bun remove" as const),
  Match.when("npm", () => "npm uninstall" as const),
  Match.when("pnpm", () => "pnpm remove" as const),
  Match.when("yarn", () => "yarn remove" as const),
  Match.exhaustive,
);

type PackageManagerService = {
  getInstallCommand: typeof getInstallCommand;
  getUninstallCommand: typeof getUninstallCommand;
};

export class PackageManagerLayer extends Context.Tag("service/PackageManagerLayer")<PackageManagerLayer, PackageManagerService>() {
  static Live = Layer.succeed(PackageManagerLayer, {
    getInstallCommand,
    getUninstallCommand,
  });
}
