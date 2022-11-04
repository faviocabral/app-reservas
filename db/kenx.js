const config = require('../knexfile.js')['development']
const db = require('knex')(config)
module.exports = db
