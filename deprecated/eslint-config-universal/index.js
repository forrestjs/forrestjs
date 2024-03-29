module.exports = {
  extends: ['react-app', 'react'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src', './services/webapp/src'],
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    semi: ['error', 'never'],
    indent: [2, 4, { SwitchCase: 1 }],
    'operator-linebreak': ['error', 'before'],
    'comma-dangle': ['error', 'always-multiline'],
    'quote-props': ['error', 'as-needed'],
    'array-bracket-spacing': ['error', 'always', { singleValue: false }],
    'new-cap': [2, { capIsNewExceptions: ['express.Router'] }],
    'import/no-unresolved': [0],
    'react/require-default-props': [2],
    'react/prefer-stateless-function': [2, { ignorePureComponents: true }],
    'prefer-reflect': [0],
  },
};
