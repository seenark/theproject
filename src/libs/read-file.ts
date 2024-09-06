import { readFile } from "node:fs/promises";
import { Effect } from "effect";
import { TaggedError } from "effect/Data";

class ReadFileError extends TaggedError("ReadFileError")<{ error: unknown }> {
  static new = (error: unknown) => new ReadFileError({ error });
}
export function readFileFromPath(path: string) {
  return Effect.tryPromise({
    try: () => readFile(path, { encoding: "utf-8" }),
    catch: ReadFileError.new,
  });
}
