import { Args, Command } from "@effect/cli";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Console, Effect, pipe } from "effect";

// define a text args for command line
const text = Args.text({
  name: "text",
});

// define top level command
const command = Command.make("hello-world", {}, () => {
  return Console.log("Hello World!");
});

// setup cli
const cli = Command.run(command, {
  name: "Hello World CLI",
  version: "v0.0.1",
});

pipe(process.argv, cli, Effect.provide(BunContext.layer), BunRuntime.runMain);
