module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "prettier",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "prettier",
        "@typescript-eslint"
    ],
    "rules": {
        "prettier/prettier": "error",
        "react/prop-types":[0],
        "@typescript-eslint/no-explicit-any":[0],
        "@typescript-eslint/explicit-function-return-type":[0],
        "@typescript-eslint/no-use-before-define":[0],
    }
};