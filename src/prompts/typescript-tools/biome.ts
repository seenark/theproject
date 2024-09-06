import { Prompt } from "@effect/cli";

export const useDefaultConfigOrUseOurTemplate = Prompt.select({
  message: "use default config or use our pre-config",
  choices: [
    { title: "default config", value: "default" as const, description: "init default config for biome" },
    { title: "pre config", value: "pre-config" as const, description: "use our pre-config for biome" },
  ],
});
