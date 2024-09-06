import { type PackageManager, PackageManagerLayer } from "@services/package-manager";
import { shellExeca } from "@services/shell";
import { Effect } from "effect";

export const eslintOfficialPackages = ["eslint", "globals", "@eslint/js", "typescript-eslint"] as const;
export const configFiles = ["eslint.config.js", "eslint.config.mjs"] as const;

export function uninstallPackages(packageManager: PackageManager) {
  return (packages: string[]) => Effect.all({
    packageManagerService: PackageManagerLayer,
  }).pipe(
    Effect.map(({ packageManagerService }) => packageManagerService.getUninstallCommand(packageManager)),
    Effect.flatMap(cmd => shellExeca(cmd, packages)),
  );
}
