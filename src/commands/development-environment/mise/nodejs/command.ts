import { Args, Command } from "@effect/cli";
import { MiseLayer } from "@services/mise";
import { Effect } from "effect";
import { green } from "kolorist";

const packageManager = Args.choice([["npm", "npm"] as const, ["pnpm", "pnpm"] as const, ["yarn", "yarn"] as const] as const);

export const nodejsCommand = Command.make(green("node"), { packageManager }, _configs => Effect.flatMap(MiseLayer, mise => mise.node));
