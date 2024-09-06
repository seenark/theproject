import { devEnvCommand } from "@cmd/development-environment";
import { typescriptToolsCommand } from "@cmd/typescript-tools";
import * as Cli from "@effect/cli";
import * as Prompts from "@prompts/index";
import { Console } from "effect";

const preconfigCommand = Cli.Command.make("theproject", {}, () => {
  return Console.log(
    "this CLI command for setup new project and isntall libs with preconfig",
  );
});

const selectingModeCmd = Cli.Command.make("select-mode", {}, () => Prompts.prompt);

const command = preconfigCommand.pipe(Cli.Command.withSubcommands([selectingModeCmd, devEnvCommand, typescriptToolsCommand]));

// const command = Cli.Command.prompt(
//   "theproject",
//   selectToolsPrompt(),
//   (selected) => {
//     return Match.value(selected).pipe(
//       Match.when("dev-env", () =>
//         Effect.Do.pipe(
//           Effect.bind("packageManager", () => packageManagerPrompt),
//           Effect.flatMap(({ packageManager }) =>
//             Match.value(packageManager).pipe(
//               Match.when("bun", () => createMiseBun()),
//               Match.orElse(() => createMiseNode()),
//             ),
//           ),
//         )),
//       Match.orElse(() => Console.log("no select")),
//     );
//   },
// );

// const command = Cli.Command.prompt(
//   "theproject",
//   packageManagerPrompt,
//   (pm) => {
//     return Console.log(pm);
//   },
// );

export const run = command.pipe(Cli.Command.run({
  name: "theproject",
  version: "0.0.1",
  summary: Cli.Span.text("only one command to create new project"),
}));
