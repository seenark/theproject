import { FileSystem } from "@effect/platform/FileSystem";
import { writeFileToPath } from "@libs/write-file";
import { ShellLayer, shellCommand } from "@services/shell";
import * as JsMiseTemplate from "@templates/development-environment/mise";
import { Console, Effect, pipe } from "effect";
import { red } from "kolorist";

export function createMiseNodeFromTemplate() {
  const filename = ".mise.toml";
  return Effect.all({
    filename: Effect.succeed(filename),
    fs: FileSystem,
  }).pipe(
    Effect.flatMap(({ fs, filename }) => fs.exists(filename)),
    Effect.flatMap(
      Effect.if({
        onTrue: () => pipe(`file ${filename} already exists`, red, Console.log),
        onFalse: () => pipe(
          writeFileToPath(JsMiseTemplate.template("node"))(filename),
          Effect.tap(
            shellCommand("mise ls"),
          ),
        ),
      }),
    ),
  );
}

const packages = [
  "\"nodejs@latest\"",
  "\"npm:@antfu/ni@latest\"",
  "\"npm:corepack@latest\"",
] as const;

export const createMiseNode = Effect.all({
  shell: ShellLayer,
}).pipe(
  Effect.flatMap(({ shell }) => shell.execa("mise use", [...packages])),
);
