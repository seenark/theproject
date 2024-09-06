import { Prompt } from "@effect/cli";
import { MiseLayer } from "@services/mise";
import { Console, Effect, Match } from "effect";
import { blue, green, lightRed, magenta, yellow } from "kolorist";


export const prompt = Prompt.select({
  message: "select your development languages",
  choices: [
    { title: green("NodeJS"), value: "nodejs" as const, description: "use nodejs with corepacks in your project", },
    { title: yellow("Bun"), value: "bun" as const, description: "use bun in your project" },
    { title: lightRed("Elixir"), value: "elixir" as const, description: "use elixir in your project" },
    { title: magenta("Gleam"), value: "gleam" as const, description: "use gleam in your project" },
    { title: blue("Go"), value: "go" as const, description: "use go in your project" },
  ],
}).pipe(
  Effect.map((v) => ({ selected: v })),
  Effect.bind("miseService", () => MiseLayer),
  Effect.flatMap(({ selected, miseService }) => Match.value(selected).pipe(
    Match.when("nodejs", () => miseService.node),
    Match.when("bun", () => miseService.bun),
    Match.when("elixir", () => Console.log("Elixir WIP")),
    Match.when("gleam", () => Console.log("Gleam WIP")),
    Match.when("go", () => miseService.go),
    Match.exhaustive
  ))
)
