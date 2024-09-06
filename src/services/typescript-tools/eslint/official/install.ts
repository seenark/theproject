import type { PackageManager } from "@services/package-manager";
import { shellExeca } from "@services/shell";
import { Match, pipe } from "effect";

const getInstallCommand = Match.type<PackageManager>().pipe(
  Match.when("npm", () => "npm init @eslint/config@latest" as const),
  Match.when("yarn", () => "yarn create @eslint/config" as const),
  Match.when("pnpm", () => "pnpm create @eslint/config@latest" as const),
  Match.when("bun", () => "bun create @eslint/config@latest" as const),
  Match.exhaustive,
);

type InstallCommand = ReturnType<typeof getInstallCommand>;

const install = (installCommand: InstallCommand) => shellExeca(installCommand);

export function installUsingPackageManager(packageManager: PackageManager) {
  return pipe(
    packageManager,
    getInstallCommand,
    install,
  );
}
