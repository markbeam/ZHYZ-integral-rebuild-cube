// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': 0,
    'keyword-spacing': ['error', {// if / for 和括号之间不能有空格 
      'overrides': {
        'if': { 
          'after': false
        },
        'for': {
          'after': false 
        }
      } 
    }],
    // "camelcase": 0, // 不用驼峰命名法
    'no-tabs': 'off',
    'no-spaced-func': 0,
    'space-before-function-paren': ['error', 'never'], // 函数名字和括号之间不能有空格
    'no-trailing-spaces': ['error', {
      "skipBlankLines": true
    }]
  }
}
