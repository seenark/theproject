import { Command } from "@effect/cli";
import { blue } from "kolorist";
import { biomeCommand } from "./biome";
import { eslintCommand } from "./eslint";

export const typescriptToolsCommand = Command.make(blue("typescript-tool")).pipe(
  Command.withDescription("install typescript tool to your typescript project"),
  Command.withSubcommands([biomeCommand, eslintCommand]),
);
