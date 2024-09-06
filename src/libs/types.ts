import { Brand } from "effect";

export type Template = string & Brand.Brand<"Template">;
export const Template = Brand.nominal<Template>();
