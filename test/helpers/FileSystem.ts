import { Effect, Layer } from "effect";
import { FileSystem } from "@effect/platform/FileSystem";
import { SystemError } from "@effect/platform/Error";

const systemError = SystemError({
  reason: "AlreadyExists",
  pathOrDescriptor: "",
  module: "FileSystem",
  method: "",
  message: "",
});

export const FileSystemLayerTest = {
  systemError,
  succeed: Layer.succeed(FileSystem, FileSystem.of({
    exists: () => Effect.succeed(true),
    remove: (_path: string) => Effect.void,
    // eslint-disable-next-line ts/no-explicit-any
  } as any,
  )),
  failed: Layer.succeed(FileSystem, FileSystem.of({
    exists: () => Effect.succeed(true),
    remove: (_path: string) => Effect.fail(systemError),
    // eslint-disable-next-line ts/no-explicit-any
  } as any,
  )),
};
