import type { PackageManager } from "@services/package-manager";
import { describe, expect, it } from "vitest";
import { packages } from "./constants";
import { getUninstallCommand } from "./uninstall";

const getUninstallCommandTestCases = [
  {
    pm: "npm" as PackageManager,
    expected: `npm uninstall ${packages.join(" ")}`,
  },
  {
    pm: "pnpm" as PackageManager,
    expected: `pnpm remove ${packages.join(" ")}`,
  },
  {
    pm: "yarn" as PackageManager,
    expected: `yarn remove ${packages.join(" ")}`,
  },
  {
    pm: "bun" as PackageManager,
    expected: `bun remove ${packages.join(" ")}`,
  },
];

describe("eslint Antfu config uninstall commands", () => {
  it.each(getUninstallCommandTestCases)("should return install command for $pm", ({ pm, expected }) => {
    const cmd = getUninstallCommand(pm);
    expect(cmd).toBe(expected);
  });
});
