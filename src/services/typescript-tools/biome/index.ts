import { Context, Layer } from "effect";
import { createBiomeJson } from "./custom-config";
import { init, install, installAndInit, uninstall } from "./install";
import { removeBiomeJson } from "./remove-config";

export type BiomeService = {
  readonly install: typeof install;
  readonly init: typeof init;
  readonly removeBiomeJson: typeof removeBiomeJson;
  readonly installAndInit: typeof installAndInit;
  readonly uninstall: typeof uninstall;
  readonly createPreconfigBiomeJson: typeof createBiomeJson;
};

export const biomeServices: BiomeService = {
  install,
  init,
  removeBiomeJson,
  installAndInit,
  uninstall,
  createPreconfigBiomeJson: createBiomeJson,
};

export class BiomeLayer extends Context.Tag("Services/Biome")<BiomeLayer, BiomeService>() {
  static readonly Live = Layer.succeed(this, {
    install,
    init,
    removeBiomeJson,
    installAndInit,
    uninstall,
    createPreconfigBiomeJson: createBiomeJson,
  });
}
