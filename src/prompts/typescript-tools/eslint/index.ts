import { Prompt } from "@effect/cli";
import { TypescriptToolsLayer } from "@services/typescript-tools";
import type { PackageManager } from "@services/package-manager";
import { Effect, Match, pipe } from "effect";
import { installOrRemovePrompt } from "../libs/install-or-remove";

export function eslintPrompt(packageManager: PackageManager) {
  return Prompt.select({
    message: "eslint",
    choices: [
      { title: "Official", value: "official" as const, description: "install official eslint" },
      {
        title: "Antony fu",
        value: "antfu" as const,
        description: "install eslint preconfig from Antony fu",
      },
    ],
  }).pipe(
    Effect.flatMap(selected =>
      Effect.all({
        selected: Effect.succeed(selected),
        tsToolsService: TypescriptToolsLayer,
        installOrRemove: installOrRemovePrompt,
      }),
    ),
    Effect.flatMap(({ selected, tsToolsService: { eslint, common }, installOrRemove }) =>
      Match.value({ selected, installOrRemove }).pipe(
        Match.when({ selected: "official", installOrRemove: "install" }, () =>
          eslint.official.install(packageManager)),
        Match.when({ selected: "official", installOrRemove: "remove" }, () =>
          pipe(
            eslint.official.uninstallPackage(packageManager)([
              ...eslint.official.eslintOfficialPackages,
            ]),
            Effect.tap(eslint.commons.removeAllEslintConfigFile()),
          )),
        Match.when({ selected: "antfu", installOrRemove: "install" }, () =>
          eslint.antfu
            .install(packageManager)
            .pipe(Effect.tap(() => common.install(packageManager)))),
        Match.when({ selected: "antfu", installOrRemove: "remove" }, () =>
          eslint.antfu
            .uninstall(packageManager)
            .pipe(Effect.tap(eslint.commons.removeAllEslintConfigFile()))),
        Match.exhaustive,
      ),
    ),
  );
}
