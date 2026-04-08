import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    ...pluginVue.configs["flat/recommended"],
    prettier,
    {
        rules: {
            // TypeScript overrides
            "@typescript-eslint/consistent-type-definitions": ["error", "type"],

            // General JS
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "error",
            eqeqeq: ["error", "always"],
            "object-shorthand": "error",
            "prefer-const": "error",
        },
    },
    {
        files: ["*.vue", "**/*.vue"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            // Vue
            "vue/component-name-in-template-casing": [
                "error",
                "PascalCase",
                { registeredComponentsOnly: false },
            ],
            "vue/define-macros-order": ["error", { order: ["defineProps", "defineEmits"] }],
            "vue/no-unused-vars": "error",
            "vue/no-unused-refs": "error",
            "vue/no-v-html": "warn",
            "vue/require-explicit-emits": "error",
            "vue/v-bind-style": "error",
            "vue/v-on-style": "error",
        },
    },
    {
        ignores: ["dist/**", "node_modules/**"],
    },
);
