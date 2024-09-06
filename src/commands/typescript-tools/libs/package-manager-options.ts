import { Options } from "@effect/cli";
import { blue, gray, green, red, yellow } from "kolorist";

export const packageManagerOption = Options.choice("use-package-manager", [
  green("npm"),
  yellow("pnpm"),
  blue("yarn"),
  gray("bun"),
] as const).pipe(
  Options.withAlias("u"),
  Options.withDescription(red("QUESTION:>> select your package manager")),
);
