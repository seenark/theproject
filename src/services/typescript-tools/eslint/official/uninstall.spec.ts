import { describe, expect, it } from "vitest";
import { type PackageManager, PackageManagerLayer } from "@services/package-manager";
import { Effect, Exit, Layer, pipe } from "effect";
import { ShellLayer } from "@services/shell";
import { SystemError } from "@effect/platform/Error";
import { uninstallPackages } from "./uninstall";

const errorResult = SystemError({
  reason: "AlreadyExists",
  pathOrDescriptor: "",
  module: "FileSystem",
  method: "",
  message: "",
});

const testCases = [
  {
    pm: "npm" as PackageManager,
    success: true,
    expected: undefined,
  },
  {
    pm: "pnpm" as PackageManager,
    success: true,
    expected: undefined,
  },
  {
    pm: "yarn" as PackageManager,
    success: true,
    expected: undefined,
  },
  {
    pm: "bun" as PackageManager,
    success: true,
    expected: undefined,
  },
  {
    pm: "npm" as PackageManager,
    success: false,
    expected: errorResult,
  },
  {
    pm: "pnpm" as PackageManager,
    success: false,
    expected: errorResult,
  },
  {
    pm: "yarn" as PackageManager,
    success: false,
    expected: errorResult,
  },
  {
    pm: "bun" as PackageManager,
    success: false,
    expected: errorResult,
  },
];

describe("eslint official uninstallation", () => {
  it.each(testCases)("uninstall eslint official", async ({ pm, expected, success }) => {
    const packageManagerLive = PackageManagerLayer.Live;

    const shellLayerTest = Layer.succeed(ShellLayer, ShellLayer.of({
      execa: () => success ? Effect.succeed(expected) : Effect.fail(ShellLayer.ExecaFailed("cmd")(expected)),
    }));

    const layerTest = Layer.mergeAll(packageManagerLive, shellLayerTest);

    const exit = await pipe(
      uninstallPackages(pm)(["@eslint/js-test"]),
      Effect.provide(layerTest),
      Effect.runPromiseExit,
    );

    if (success) {
      expect(exit).toEqual(Exit.succeed(expected));
    }
    else {
      expect(exit).toEqual(Exit.fail(ShellLayer.ExecaFailed("cmd")(expected)));
    }
  });
});
