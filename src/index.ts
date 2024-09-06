import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { MiseLayer } from "@services/mise";
import { PackageManagerLayer } from "@services/package-manager";
import { ShellLayer } from "@services/shell";
import { TypescriptToolsLayer } from "@services/typescript-tools";
import { Effect, Layer } from "effect";
import { BiomeLayer } from "@services/typescript-tools/biome";
import { EslintLayer } from "@services/typescript-tools/eslint";
import { EslintOfficialLayer } from "@services/typescript-tools/eslint/official";
import { EslintAntfuLayer } from "@services/typescript-tools/eslint/antfu";
import { EslintCommonLayer } from "@services/typescript-tools/eslint/commons";
import { TypescriptToolsCommonLayer } from "@services/typescript-tools/common";
import { run } from "./cli";
import { PromptLayer } from "./prompts";

const eslintLive = EslintLayer.Live.pipe(
  Layer.provide(EslintOfficialLayer.Live),
  Layer.provide(EslintAntfuLayer.Live),
  Layer.provide(EslintCommonLayer.Live),
);
const tsToolsLive = TypescriptToolsLayer.Live.pipe(
  Layer.provide(BiomeLayer.Live),
  Layer.provide(eslintLive),
  Layer.provide(TypescriptToolsCommonLayer.Live),
);

const mainLive = Layer.mergeAll(NodeContext.layer, MiseLayer.Live, tsToolsLive, PackageManagerLayer.Live, ShellLayer.Live, PromptLayer.Live);

run(process.argv).pipe(
  Effect.catchAll(() => Effect.void),
  Effect.provide(mainLive),
  NodeRuntime.runMain,
);
