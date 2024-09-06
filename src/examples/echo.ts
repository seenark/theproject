import { Args, Command, Options } from "@effect/cli";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Console, Effect, Option, pipe } from "effect";

// define a text args for command line
const text = Args.text({
  name: "text",
});

const bold = pipe(
  "bold",
  Options.boolean,
  Options.withAlias("b"),
  Options.withDefault(false),
);

const color = Options.choice("color", ["red", "green", "blue"]).pipe(
  Options.withAlias("c"),
  Options.optional,
);

// Color codes for ANSI escape sequences
const colorCodes: { [k: string]: string } = {
  red: "\x1B[31m",
  green: "\x1B[32m",
  blue: "\x1B[34m",
};
const resetCode = "\x1B[0m";

function applyColor(text: string, color: Option.Option<string>): string {
  return Option.match(color, {
    onNone: () => text,
    onSome: c => `${colorCodes[c]}${text}${resetCode}`,
  });
}

function applyBold(text: string, bold: boolean): string {
  return bold ? `\x1B[1m${text}\x1B[0m` : text;
}

// args for subcommand `repeat` that do number of commands to repeated
const count = Args.integer().pipe(Args.withDefault(1));

const repeat = Command.make("repeat", { count }, ({ count }) => {
  return echo.pipe(
    Effect.andThen(config => Effect.repeatN(echo.handler(config), count - 1)),
  );
});

// define top level command
const echo = Command.make(
  "echo",
  { text, bold, color },
  ({ text, bold, color }) => {
    return pipe(
      applyColor(text, color),
      text => applyBold(text, bold),
      Console.log,
    );
  },
);

const command = echo.pipe(Command.withSubcommands([repeat]));

// setup cli
const cli = Command.run(command, {
  name: "Echo CLI",
  version: "v0.0.1",
});

pipe(process.argv, cli, Effect.provide(BunContext.layer), BunRuntime.runMain);
