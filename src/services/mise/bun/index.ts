import type { PlatformError } from "@effect/platform/Error";
import { FileSystem } from "@effect/platform/FileSystem";
import type { WriteFileError } from "@libs/write-file";
import { writeFileToPath } from "@libs/write-file";
import { ShellLayer } from "@services/shell";
import * as JsMiseTemplate from "@templates/development-environment/mise";
import { Console, Effect, pipe } from "effect";
import { red } from "kolorist";

// export function createMiseBunFromTemplate(): Effect.Effect<void, PlatformError | WriteFileError, FileSystem> {
//   const filename = ".mise.toml";
//   return Effect.all({
//     filename: Effect.succeed(filename),
//     fs: FileSystem,
//   }).pipe(
//     Effect.flatMap(({ fs, filename }) => fs.exists(filename)),
//     Effect.map(d => d),
//     Effect.flatMap(
//       Effect.if({
//         onTrue: () => pipe(`file ${filename} already exists`, red, Console.log),
//         onFalse: () =>
//           writeFileToPath(JsMiseTemplate.template("bun"))(filename),
//       }),
//     ),
//   );
// }

export const createMiseBun = Effect.all({
  shellService: ShellLayer,
}).pipe(
  Effect.flatMap(({ shellService }) => shellService.execa("mise use", ["bun@latest"])),
);
