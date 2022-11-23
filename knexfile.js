// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    /* mysql  */
  /*  client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',	
      password : '',
      database : 'agenda_renting'
*/
     /* sql server  */ 
     client: 'mssql',
     connection: {
       host : '192.168.10.160',
       port : 1433,
       user : 'sa',	
       password : 'Sqlservices*',
       database : 'control'
 
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',	
      password : '',
      database : 'agenda_renting'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',	
      password : '',
      database : 'agenda_renting'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
