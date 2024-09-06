import { Command } from "@effect/cli";
import type { PackageManager } from "@services/package-manager";
import { TypescriptToolsLayer } from "@services/typescript-tools";
import { Effect } from "effect";
import { stripColors } from "kolorist";
import { packageManagerOption } from "../libs/package-manager-options";

const installCommand = Command.make("install", { packageManagerOption }).pipe(
  Command.withDescription("install eslint to your js/ts project"),
  Command.withHandler(({ packageManagerOption }) => {
    return Effect.all({
      ts: TypescriptToolsLayer,
    }).pipe(
      Effect.let("pm", () => stripColors(packageManagerOption) as PackageManager),
      Effect.flatMap(({ ts, pm }) => ts.eslint.official.install(pm)),
    );
  }),
);

export const eslintCommand = Command.make("eslint", {}).pipe(
  Command.withSubcommands([installCommand]),
);
