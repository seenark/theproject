import type { PackageManager } from "@services/package-manager";
import { ShellLayer } from "@services/shell";
import { Effect, Match, pipe } from "effect";
import { packages } from "./constants";

const getUninstallCommand = Match.type<PackageManager>().pipe(
  Match.when("npm", () => `npm uninstall ${packages.join(" ")}` as const),
  Match.when("pnpm", () => `pnpm remove ${packages.join(" ")}` as const),
  Match.when("yarn", () => `yarn remove ${packages.join(" ")}` as const),
  Match.when("bun", () => `bun remove ${packages.join(" ")}` as const),
  Match.exhaustive,

);

export function uninstall(packageManager: PackageManager) {
  return Effect.all({
    shell: ShellLayer,
  }).pipe(
    Effect.flatMap(({ shell: { execa } }) => pipe(
      packageManager,
      getUninstallCommand,
      execa,
    ),
    ),
  );
}
