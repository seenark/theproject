import { Context, Effect, Layer } from "effect";
import { BiomeLayer, type BiomeService, biomeServices } from "./biome";
import { EslintLayer, type EslintService } from "./eslint";
import { TypescriptToolsCommonLayer, type TypescriptToolsCommonService } from "./common";

type TypescriptToolsService = {
  biome: BiomeService;
  eslint: EslintService;
  common: TypescriptToolsCommonService;
};

export class TypescriptToolsLayer extends Context.Tag("services/TypescriptToolsLayer")<
  TypescriptToolsLayer,
  TypescriptToolsService
>() {
  static Live = Layer.effect(
    this,
    Effect.all({
      biome: BiomeLayer,
      eslint: EslintLayer,
      common: TypescriptToolsCommonLayer,
    }),
  );
}
