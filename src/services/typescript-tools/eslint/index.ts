import { Context, Effect, Layer } from "effect";
import * as Official from "./official";
import type { EslintOfficialService } from "./official";
import { EslintAntfuLayer, type EslintAntfuService } from "./antfu";
import { EslintCommonLayer, type EslintCommonServices } from "./commons";

export type EslintService = {
  antfu: EslintAntfuService;
  official: EslintOfficialService;
  commons: EslintCommonServices;
};

export class EslintLayer extends Context.Tag("services/Eslint")<EslintLayer, EslintService>() {
  static readonly Live = Layer.effect(this, Effect.all({
    official: Official.EslintOfficialLayer,
    antfu: EslintAntfuLayer,
    commons: EslintCommonLayer,
  }));
}
