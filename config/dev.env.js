'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT: '"//10.21.168.65:9054/jifen2/api.php?s="'
  API_ROOT: '"//139.199.1.240/jifen2/api.php?s="'
})
