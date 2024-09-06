import { Args, Command, Options } from "@effect/cli";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Array, Console, Effect, Option, pipe } from "effect";

// minigit [--version] [-h | --help] [-c <name>=<value>]
const configs = Options.keyValueMap("c").pipe(Options.optional);

const minigit = Command.make("minigit", { configs }, ({ configs }) => {
  return Option.match(configs, {
    onNone: () => Console.log("Running minigit"),
    onSome: (configs) => {
      const keyValuePairs = Array.fromIterable(configs)
        .map(([key, value]) => `${key}=${value}`)
        .join(",");
      return Console.log(`Running minigit with configs: ${keyValuePairs}`);
    },
  });
});

// minigit add [-v | --verbose] [--] [<pathspec>...]
const pathspec = Args.text({ name: "pathspec" }).pipe(Args.repeated);
const verbose = Options.boolean("verbose").pipe(Options.withAlias("v"));
const minigitAdd = Command.make(
  "add",
  { pathspec, verbose },
  ({ pathspec, verbose }) => {
    const paths = Array.match(pathspec, {
      onEmpty: () => "",
      onNonEmpty: paths => `${Array.join(paths, " ")}`,
    });
    return Console.log(
      `Running minigit add with paths: ${paths} with '--verbose ${verbose}'`,
    );
  },
);

// minigit clone [--depth <depth>] [--] <repository> [<directory>]
const repo = Args.text({ name: "repo" });
const dir = Args.text({ name: "dir" }).pipe(Args.optional);
const depth = Options.integer("depth").pipe(Options.optional);
const minigitClone = Command.make("clone", { repo, dir, depth }, (config) => {
  return Effect.flatMap(minigit, (parentConfig) => {
    const depth = pipe(
      config.depth,
      Option.map(d => `--depth ${d}`),
    );
    const repository = Option.some(config.repo);
    const optionsAndArgs = Array.getSomes([depth, repository, config.dir]);

    const newConfigs = Option.match(parentConfig.configs, {
      onNone: () => "",
      onSome: map =>
        Array.fromIterable(map)
          .map(([key, value]) => `${key}=${value}`)
          .join(","),
    });
    return Console.log(
      `Running minigit clone with options and args: ${Array.join(optionsAndArgs, ", ")} and configs: ${newConfigs}`,
    );
  });
});

const command = minigit.pipe(
  Command.withSubcommands([minigitAdd, minigitClone]),
);

const cli = Command.run(command, {
  name: "Minigit",
  version: "v0.0.1",
});

pipe(process.argv, cli, Effect.provide(BunContext.layer), BunRuntime.runMain);
