import { writeFile } from "node:fs/promises";
import { Effect } from "effect";
import { TaggedError } from "effect/Data";
import type { Template } from "./types";

export class WriteFileError extends TaggedError("WriteFileError")<{ error: unknown }> {
  static new = (error: unknown) => new WriteFileError({ error });
}

export function writeFileToPath(content: Template) {
  return (path: string) =>
    Effect.tryPromise({
      try: () => writeFile(path, content),
      catch: WriteFileError.new,
    });
}
