import type { PackageManager } from "@services/package-manager";
import { ShellLayer } from "@services/shell";
import { Context, Effect, Layer, Match, pipe } from "effect";

const installCommands = {
  npm: "npm i",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

const uninstallCommands = {
  npm: "npm uninstall",
  pnpm: "pnpm remove",
  yarn: "yarn remove",
  bun: "bun remove",
};

const getInstallCommand = Match.type<PackageManager>().pipe(
  Match.when("npm", () => installCommands.npm),
  Match.when("pnpm", () => installCommands.pnpm),
  Match.when("yarn", () => installCommands.yarn),
  Match.when("bun", () => installCommands.bun),
  Match.exhaustive,
);

const getUnInstallCommand = Match.type<PackageManager>().pipe(
  Match.when("npm", () => uninstallCommands.npm),
  Match.when("pnpm", () => uninstallCommands.pnpm),
  Match.when("yarn", () => uninstallCommands.yarn),
  Match.when("bun", () => uninstallCommands.bun),
  Match.exhaustive,
);

function install(PackageManager: PackageManager) {
  return ShellLayer.pipe(
    Effect.flatMap(shell => pipe(PackageManager, getInstallCommand, shell.execa)),
  );
}

function uninstall(PackageManager: PackageManager) {
  return ShellLayer.pipe(
    Effect.flatMap(shell => pipe(PackageManager, getUnInstallCommand, shell.execa)),
  );
}

const make = {
  install,
  uninstall,
};

export type TypescriptToolsCommonService = typeof make;

export class TypescriptToolsCommonLayer extends Context.Tag("services/typescript-tools/common")<
  TypescriptToolsCommonService,
  TypescriptToolsCommonService
>() {
  static Live = Layer.succeed(this, make);
}
