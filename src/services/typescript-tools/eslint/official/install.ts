import type { PackageManager } from "@services/package-manager";
import { ShellLayer, shellExeca } from "@services/shell";
import { Effect, Match, pipe } from "effect";

export const getInstallCommand = Match.type<PackageManager>().pipe(
  Match.when("npm", () => "npm init @eslint/config@latest" as const),
  Match.when("yarn", () => "yarn create @eslint/config" as const),
  Match.when("pnpm", () => "pnpm create @eslint/config@latest" as const),
  Match.when("bun", () => "bun create @eslint/config@latest" as const),
  Match.exhaustive,
);

type InstallCommand = ReturnType<typeof getInstallCommand>;

function install(installCommand: InstallCommand) {
  return ShellLayer.pipe(
    Effect.flatMap(({ execa }) => execa(installCommand)),
  );
}

export function installUsingPackageManager(packageManager: PackageManager) {
  return pipe(
    packageManager,
    getInstallCommand,
    install,
  );
}
