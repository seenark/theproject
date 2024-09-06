import { Context, Layer } from "effect";
import * as Install from "./install";
import * as Uninstall from "./uninstall";

const make = {
  install: Install.installUsingPackageManager,
  uninstallPackage: Uninstall.uninstallPackages,
  // removeAllEslintConfigs: Uninstall.removeAllEslintConfigFile,
  eslintOfficialPackages: Uninstall.eslintOfficialPackages,
};

export type EslintOfficialService = typeof make;

export class EslintOfficialLayer extends Context.Tag("services/Eslint/Official")<EslintOfficialLayer, EslintOfficialService>() {
  static Live = Layer.succeed(this, make);
}
