module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    "import/extensions": "off",
    "camelcase": "off",
    "react/jsx-filename-extension": [
      2,
      {
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
    ],
    "quotes": [
      "error",
      "double"
    ],
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": "off",
    "no-underscore-dangle": "off",
    "jsx-a11y/media-has-caption": "off",
    "no-param-reassign": "off",
    "no-console": "off",
    "no-template-curly-in-string": "off",
    "prefer-promise-reject-errors": "off",
    "object-curly-newline": ["error", {
      "ImportDeclaration": { "multiline": true, "minProperties": 6 }
    }],
    // "import/no-extraneous-dependencies": ["off", { "devDependencies": true }], // fix this later
    "import/no-extraneous-dependencies": "off",
    "no-nested-ternary": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "eslintjsx-a11y/no-noninteractive-element-interactions": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "prefer-destructuring": ["error", {"object": true, "array": false}],
    "@typescript-eslint/no-unused-vars": "off",
    "react-hooks/exhaustive-deps": "off"
  },
};
