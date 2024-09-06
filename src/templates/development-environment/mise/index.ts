import type { Template } from "@libs/types";

export function template(runtime: "bun" | "node", version = "latest") {
  return `[tools]
${runtime} = "${version}"
"npm:typescript" = "latest"
"npm:@antfu/ni" = "latest"
${runtime === "node" ? "\"npm:corepack\" = \"latest\"" : ""}

[env]
NODE_ENV = "development"
# '_'.file = ".env"

[plugins]

[settings]
status.missing_tools = "if_other_versions_installed"
status.show_env = true
status.show_tools = true
` as Template;
}
