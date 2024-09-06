import { Prompt } from "@effect/cli";
import * as PackageManagerPrompt from "@prompts/package-manager";
import * as BiomePrompt from "@prompts/typescript-tools/biome";
import * as Libs from "@prompts/typescript-tools/libs/install-or-remove";
import { TypescriptToolsLayer } from "@services/typescript-tools";
import { Effect, Match } from "effect";
import { blue, magenta } from "kolorist";
import { eslintPrompt } from "./eslint";

export const tsToolsPrompt = Prompt.select({
  message: "select your typescript tools",
  choices: [
    { title: blue("Biome"), value: "biome" as const, description: "install biome into your project" },
    { title: magenta("Eslint"), value: "eslint" as const, description: "install eslint into your project" },
  ],
}).pipe(
  Effect.map(v => ({ selected: v })),
  Effect.bind("tsService", () => TypescriptToolsLayer),
  Effect.bind("pm", () => PackageManagerPrompt.prompt),
  Effect.flatMap(({ selected, tsService, pm }) => Match.value(selected).pipe(
    Match.when("biome", () => Libs.installOrRemovePrompt.pipe(
      Effect.flatMap(d => Match.value(d).pipe(
        Match.when("install", () => tsService.biome.install(pm).pipe(
          Effect.flatMap(() => BiomePrompt.useDefaultConfigOrUseOurTemplate),
          Effect.flatMap(d => Match.value(d).pipe(
            Match.when("default", () => tsService.biome.init(pm)),
            Match.when("pre-config", () => tsService.biome.createPreconfigBiomeJson),
            Match.exhaustive,
          )),
        )),
        Match.when("remove", () => tsService.biome.uninstall(pm).pipe(
          Effect.tap(tsService.biome.removeBiomeJson),
        )),
        Match.exhaustive,
      )),
    )),
    Match.when("eslint", () => eslintPrompt(pm)),
    Match.exhaustive,
  )),
);
