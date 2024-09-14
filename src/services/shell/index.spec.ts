import { describe, expect, it, vi } from "vitest";
import { Cause, Effect, Exit, pipe } from "effect";
import { execa } from "execa";
import type { CommonResult, OmitErrorIfReject } from "node_modules/execa/types/return/result";
import type { ExecaFailed } from ".";
import { shellExeca } from ".";

type Result = CommonResult<false, {
  stdio: "inherit";
  shell: true;
  reject: false;
}> & OmitErrorIfReject<false>;

vi.mock("execa");

describe("shell execa service", () => {
  it("should return void when the command succeeds", async () => {
    const result: Result = {
      failed: false,
    } as Result;

    const commands: ["echo", string[]] = ["echo", ["your name"]];

    vi.mocked(execa).mockResolvedValue(result);

    const exit = await pipe(
      shellExeca(commands[0], commands[1]),
      Effect.runPromiseExit,
    );

    // const spy = vi.spyOn(Execa, "execa");
    // const args = vi.mocked(execa).mock.calls[0];
    // console.log(args);

    expect(exit).toEqual(Exit.succeed(undefined));
    expect(execa).toHaveBeenCalledWith(commands[0], commands[1], { reject: false, shell: true, stdio: "inherit" });
    expect(execa).toHaveBeenCalledOnce();
  });

  it("should return ExecaFailed when command failed", async () => {
    const result: Result = {
      failed: true,
    } as Result;
    vi.mocked(execa).mockResolvedValue(result);

    const exit = await pipe(
      shellExeca("mise use", ["elixir@latest"]),
      Effect.runPromiseExit,
    );

    expect(execa).toHaveBeenCalledWith("mise use", ["elixir@latest"], { reject: false, shell: true, stdio: "inherit" });
    expect(execa).toHaveBeenCalledOnce();
    expect(Exit.isFailure(exit)).toBeTruthy();
    if (Exit.isFailure(exit)) {
      const cause = Cause.squash(exit.cause) as ExecaFailed;
      expect(cause._tag).toBe("ExecaFailed");
    }
  });
});
