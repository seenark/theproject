import { Context, Layer } from "effect";
import { removeAllEslintConfigFile } from "./remove-config-file";

const make = {
  removeAllEslintConfigFile,
};

export type EslintCommonServices = typeof make;

export class EslintCommonLayer extends Context.Tag("services/Eslint/Common")<EslintCommonLayer, EslintCommonServices>() {
  static Live = Layer.succeed(this, make);
}
