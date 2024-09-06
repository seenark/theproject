import type { ExecaFailed, ShellCommandFailed, ShellLayer } from "@services/shell";
import type { Effect } from "effect";
import { Context, Layer } from "effect";
import { createMiseBun } from "./bun";
import { createMiseGo } from "./go";
import { createMiseNode } from "./node";

type MiseService = {
  // bun: Effect.Effect<void, PlatformError | WriteFileError, FileSystem>;
  bun: Effect.Effect<void, ShellCommandFailed | ExecaFailed, ShellLayer>;
  node: Effect.Effect<void, ShellCommandFailed | ExecaFailed, ShellLayer>;
  go: Effect.Effect<void, ShellCommandFailed | ExecaFailed, ShellLayer>;
};

export class MiseLayer extends Context.Tag("services/Mise")<MiseLayer, MiseService>() {
  static Live = Layer.succeed(MiseLayer, {
    bun: createMiseBun,
    node: createMiseNode,
    go: createMiseGo,
  });
}
