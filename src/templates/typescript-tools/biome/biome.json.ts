export const config = {
  $schema: "https://biomejs.dev/schemas/1.8.3/schema.json",
  organizeImports: {
    enabled: true,
  },
  formatter: {
    indentStyle: "space",
    indentWidth: 2,
  },
  linter: {
    enabled: true,
    rules: {
      recommended: true,
      correctness: {
        noUnusedVariables: {
          level: "error",
          fix: "safe",
        },
      },
      complexity: {
        noStaticOnlyClass: "off",
        noBannedTypes: "off",
      },
      style: {
        useImportType: {
          level: "error",
          fix: "safe",
        },
        useNamingConvention: {
          level: "off",
          options: {
            strictCase: true,
            requireAscii: true,
            enumMemberCase: "CONSTANT_CASE",
            conventions: [
              {
                selector: {
                  kind: "objectLiteralProperty",
                  scope: "any",
                },
                formats: ["snake_case", "camelCase"],
              },
              {
                selector: {
                  kind: "classMember",
                  scope: "any",
                  modifiers: ["private"],
                },
                formats: ["camelCase"],
                match: "[$](.+)",
              },
              {
                selector: {
                  kind: "namespaceLike",
                  scope: "any",
                },
                formats: ["PascalCase"],
              },
            ],
          },
        },
      },
    },
  },
};
