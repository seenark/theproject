import { Command, Options } from "@effect/cli";
import type { PackageManager } from "@services/package-manager";
import { TypescriptToolsLayer } from "@services/typescript-tools";
import { Effect, Match } from "effect";
import { red, stripColors } from "kolorist";
import { packageManagerOption } from "../libs/package-manager-options";

const biomeJsonConfig = Options.choice("biome-config", [
  "default",
  "our-preconfig",
] as const).pipe(
  Options.withAlias("c"),
  Options.withDescription(red("QUESTION:>> select biome config")),
);

const baseCommand = Command.make("biome", { packageManagerOption }).pipe(
  Command.withDescription("install biome to your js/ts project"),
);

const biomeInstallCommand = Command.make("install", { biomeJsonConfig }, ({ biomeJsonConfig }) => {
  return Effect.all({
    ts: TypescriptToolsLayer,
    baseCommand,
  }).pipe(
    Effect.let("pm", ({ baseCommand }) => stripColors(baseCommand.packageManagerOption) as PackageManager),
    Effect.tap(({ ts: { biome }, pm }) => biome.install(pm)),
    Effect.tap(({ ts: { biome }, pm }) => Match.value(biomeJsonConfig).pipe(
      Match.when("default", () => biome.init(pm)),
      Match.when("our-preconfig", () => biome.createPreconfigBiomeJson),
      Match.exhaustive,
    )),
  );
});

const biomeUninstallCommand = Command.make("uninstall", {}, () => {
  return Effect.all({
    ts: TypescriptToolsLayer,
    baseCommand,
  }).pipe(
    Effect.flatMap(({ baseCommand, ts }) => {
      const pm = stripColors(baseCommand.packageManagerOption) as PackageManager;
      return ts.biome.uninstall(pm).pipe(
        Effect.flatMap(() => ts.biome.removeBiomeJson),
      );
    }),
  );
});

export const biomeCommand = baseCommand.pipe(
  Command.withSubcommands([biomeInstallCommand, biomeUninstallCommand]),
);
