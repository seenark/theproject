import { ShellLayer } from "@services/shell";
import { Effect } from "effect";

export const createMiseGo = Effect.all({
  shell: ShellLayer,
}).pipe(
  Effect.flatMap(({ shell }) => shell.execa("mise use", ["go@latest"]))
)
