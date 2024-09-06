import { Context, Effect, Layer } from "effect";
import { install } from "./install";
import { uninstall } from "./uninstall";

const make = {
  install,
  uninstall,
};

export type EslintAntfuService = typeof make;

export class EslintAntfuLayer extends Context.Tag("services/eslint/antfu")<EslintAntfuLayer, EslintAntfuService>() {
  static Live = Layer.succeed(this, make);
}
