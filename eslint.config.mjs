import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginCypress from 'eslint-plugin-cypress';  // Importando o plugin do Cypress

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',  // Definindo o tipo de módulo para ES6
      globals: {
        ...globals.browser,  // Variáveis globais para o ambiente de navegador
        ...globals.node,      // Variáveis globais para o Node.js
        ...pluginCypress.globals,  // Variáveis globais do Cypress
      },
    },
  },
  pluginJs.configs.recommended,  // Regras recomendadas do ESLint para JavaScript
  {
    plugins: {
      cypress: pluginCypress,  // Definindo o plugin do Cypress corretamente
    },
    rules: {
      // Outras regras personalizadas, se necessário
      'no-undef': 'off',  // Desabilita a verificação de variáveis indefinidas para o Mocha/Cypress
    },
  },
];
