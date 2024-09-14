import type { PackageManager } from "@services/package-manager";
import { ShellLayer } from "@services/shell";
import { Effect, Match, pipe } from "effect";
import { base } from "./constants";

export const installCommands = {
  npm: `npx ${base}@latest` as const,
  pnpm: `pnpm dlx ${base}@latest` as const,
  yarn: `yarn ${base}@latest` as const,
  bun: `bunx ${base}@latest` as const,
};

export const getInstallCommand = Match.type<PackageManager>().pipe(
  Match.when("npm", () => installCommands.npm),
  Match.when("pnpm", () => installCommands.pnpm),
  Match.when("yarn", () => installCommands.yarn),
  Match.when("bun", () => installCommands.bun),
  Match.exhaustive,
);

export function install(packageManager: PackageManager) {
  return Effect.all({
    shell: ShellLayer,
    installCommand: pipe(packageManager, getInstallCommand, Effect.succeed),
  }).pipe(
    Effect.flatMap(({ shell: { execa }, installCommand }) => execa(installCommand)),
  );
}
