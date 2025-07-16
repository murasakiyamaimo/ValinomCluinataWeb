import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginNext from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";
import * as pluginJs from "typescript-eslint";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest", // 最新のECMAScriptバージョンを使用
        sourceType: "module",  // ES Modules を使用
        ecmaFeatures: {
          jsx: true, // JSX を有効化
        },
      },
    },
    plugins: {
      react: pluginReact,
      "@next": pluginNext, // Next.js プラグインを登録
    },
    rules: {
      ...pluginJs.configs.recommended.rules,

      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,

      ...tseslint.configs.recommended,
      ...pluginReact.configs.flat.recommended,

      "@typescript-eslint/no-this-alias": "off",
    },
    settings: {
      react: {
        version: "detect",
      }
    }
  },
]);
