const config = require('../knexfile.js')['development']

const conn1 = require('knex')({
	client: 'mssql',
	connection: {
	  host : '192.168.10.160',
	  port : 1433,
	  user : 'sa',
	  password : 'Sqlservices*',
	  database : 'control'
	}
  });
/*
  const conn1 = require('knex')({
	client: 'mysql',
	connection: {
	  host : '127.0.0.1',
	  port : 3306,
	  user : 'root',
	  password : '',
	  database : 'agenda_renting'
	}
  });
  */
const conn2 = require('knex')({
	client: 'mssql',
	connection: {
	  host : '192.168.10.160',
	  //port : 3306,
	  user : 'sa',
	  password : 'Sqlservices*',
	  database : 'control'
	}
  });

module.exports = {conn1 , conn2 }