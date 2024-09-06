import { Prompt } from "@effect/cli";
import type { PackageManager } from "@services/package-manager";

export const packageManagerPrompt = Prompt.select<PackageManager>({
  message: "Please select your package manager",
  choices: [
    {
      title: "npm",
      value: "npm",
      description: "use npm as your package manager in nodejs",
    },
    {
      title: "pnpm",
      value: "pnpm",
      description: "use pnpm as your package manager in nodejs",
    },
    {
      title: "yarn",
      value: "yarn",
      description: "use yarn as your package manager in nodejs",
    },
    {
      title: "bun",
      value: "bun",
      description: "use bun as your package manager in bun",
    },
  ],
});
