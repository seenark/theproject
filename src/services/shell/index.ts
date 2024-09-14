import { Context, Effect, Layer } from "effect";
import { TaggedError } from "effect/Data";
import { execa } from "execa";

export class ShellCommandFailed extends TaggedError("ShellCommandFailed")<{ command?: string; error: unknown }> {
  static new = (command?: string) => <E>(error: E): ShellCommandFailed => new ShellCommandFailed({ command, error });
}

export class ExecaFailed extends TaggedError("ExecaFailed")<{ command?: string; error: unknown }> {
  static new = (command?: string) => <E>(error: E): ExecaFailed => new ExecaFailed({ command, error });
}

// export function shellCommand(command: string, args: string[] = []) {
//   return Effect.async<void, ShellCommandFailed, never>((resume) => {
//     const { exitCode } = spawn(command, args, { stdio: "inherit", shell: true }).on("close", () => {
//       if (exitCode !== null) {
//         pipe(
//           red("do command Error"),
//           ShellCommandFailed.new(`${command} ${args.join(" ")}`),
//           Effect.fail,
//           resume,
//         );
//       }
//       pipe(Effect.void, resume);
//     });
//   });
// }

export function shellExeca(command: string, args: string[] = []) {
  return Effect.tryPromise({
    try: async () => {
      const a = await execa(command, args, { stdio: "inherit", shell: true, reject: false });
      return a;
    },
    catch: (e) => {
      return ShellCommandFailed.new(command)(e);
    },
  }).pipe(
    Effect.flatMap((d) => {
      if (d.failed) {
        console.error("error", d.stderr);
        return Effect.fail(ExecaFailed.new(command)(d.stderr));
      }
      return Effect.void;
    }),
  );
}

// export function zxCommand(command: string, args: string[] = []) {
//   const cmd = `${command} ${args}`;
//   return Effect.tryPromise({
//     try: async () => {
//       const { stdout } = await $`mise ls`;
//       return stdout;
//     },
//     catch: ShellCommandFailed.new(cmd),
//   });
// }

type ShellService = {
  execa: typeof shellExeca;
};

export class ShellLayer extends Context.Tag("services/Shell")<ShellLayer, ShellService>() {
  static Live = Layer.succeed(this, {
    execa: shellExeca,
  });

  static ExecaFailed = ExecaFailed.new;
}
