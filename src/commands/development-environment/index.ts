import { bunCommand } from "@cmd/development-environment/mise/bun/command";
import { nodejsCommand } from "@cmd/development-environment/mise/nodejs/command";
import { Command } from "@effect/cli";
import { lightYellow } from "kolorist";

export const devEnvCommand = Command.make(lightYellow("devenv")).pipe(
  Command.withDescription("create development environment"),
  Command.withSubcommands([nodejsCommand, bunCommand]),
);
