import { Prompt } from "@effect/cli";

export const installOrRemovePrompt = Prompt.select({
  message: "install or remove",
  choices: [
    { title: "Install", value: "install" as const, description: "I will install the tool" },
    { title: "Remove", value: "remove" as const, description: "I will remove the tool" },
  ],
});
