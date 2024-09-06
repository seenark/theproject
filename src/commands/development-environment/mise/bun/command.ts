import { Command } from "@effect/cli";
import { MiseLayer } from "@services/mise";
import { Effect } from "effect";
import { yellow } from "kolorist";

export const bunCommand = Command.make(yellow("bun"), {}, () => Effect.flatMap(MiseLayer, d => d.bun));
