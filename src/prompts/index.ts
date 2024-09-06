import { Prompt } from "@effect/cli";
import * as DevEnvPropmt from "@prompts/development-environment";
import * as TsToolsPrompt from "@prompts/typescript-tools";
import { Context, Effect, Layer, Match } from "effect";

export const prompt = Prompt.select({
  message: "selecting",
  choices: [
    {
      title: "select development environment",
      value: "devenv" as const,
      description:
        "select this option if you want to create development environment for your project",
    },
    {
      title: "typescript tools",
      value: "ts-tools" as const,
      description: "install typescript tools with preconfig in your project",
    },
  ],
}).pipe(
  Effect.map(d => ({ selected: d })),
  Effect.bind("promptService", () => PromptLayer),
  Effect.flatMap(({ selected, promptService }) =>
    Match.value(selected).pipe(
      Match.when("devenv", () => promptService.developmentEnvironment),
      Match.when("ts-tools", () => promptService.typescriptTools),
      Match.exhaustive,
    ),
  ),
);

export type PromptService = {
  developmentEnvironment: typeof DevEnvPropmt.prompt;
  typescriptTools: typeof TsToolsPrompt.tsToolsPrompt;
};

export class PromptLayer extends Context.Tag("propts/main")<PromptLayer, PromptService>() {
  static Live = Layer.succeed(this, {
    developmentEnvironment: DevEnvPropmt.prompt,
    typescriptTools: TsToolsPrompt.tsToolsPrompt,
  });
}
