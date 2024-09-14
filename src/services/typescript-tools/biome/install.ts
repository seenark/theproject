import type { PackageManager } from "@services/package-manager";
import { ShellLayer, shellExeca } from "@services/shell";
import { Console, Effect, Match, pipe } from "effect";

const installCommand = "install --save-dev --save-exact @biomejs/biome" as const;

export const getCommand = (packageManager: PackageManager) => `${packageManager} ${installCommand}` as const;

export function install(packageManager: PackageManager) {
  return pipe(packageManager, getCommand, shellExeca, Effect.tapError((e) => {
    return Console.log("error", e);
  }));
}

const npmInitCommand = "npx @biomejs/biome init" as const;
const yarnPnpmBunInitCommand = "biome init" as const;

export function getInitCommand(packageManager: PackageManager) {
  return Match.value(packageManager).pipe(
    Match.when("npm", () => npmInitCommand),
    Match.when("bun", () => `bunx ${yarnPnpmBunInitCommand}` as const),
    Match.orElse(pm => `${pm} ${yarnPnpmBunInitCommand}` as const),
  );
}

export function init(packageManager: PackageManager) {
  return ShellLayer.pipe(
    Effect.flatMap(({ execa }) => pipe(
      getInitCommand(packageManager),
      execa,
    )),
  );
};

export function installAndInit(packageManager: PackageManager) {
  return pipe(
    packageManager,
    install,
    Effect.flatMap(() => init(packageManager)),
  );
}

export const getUninstallCommand = Match.type<PackageManager>().pipe(
  Match.when("npm", () => "npm uninstall @biomejs/biome" as const),
  Match.orElse(pm => `${pm} remove @biomejs/biome` as const),
);

export function uninstall(packageManager: PackageManager) {
  return ShellLayer.pipe(
    Effect.flatMap(({ execa }) => pipe(
      packageManager,
      getUninstallCommand,
      execa,
    )),
  );
}
