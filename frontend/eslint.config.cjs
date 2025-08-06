const {
    defineConfig,
    globalIgnores,
} = require("eslint/config")

const tsParser = require("@typescript-eslint/parser")
const react = require("eslint-plugin-react")
const typescriptEslint = require("@typescript-eslint/eslint-plugin")
const js = require("@eslint/js")

const {
    FlatCompat,
} = require("@eslint/eslintrc")

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
})

module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,
    },

    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
    },

    extends: compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
    ),

    rules: {
        "react/react-in-jsx-scope": "off",
    },

    settings: {
        react: {
            version: "detect",
        },
    },
}, globalIgnores([
    "**/package.json",
    "**/package-lock.json",
    "**/*.json",
    "**/*.md",
    "public",
    "**/*.cjs",
])])
