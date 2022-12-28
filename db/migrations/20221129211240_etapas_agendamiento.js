/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('agendarenting_etapas',(table)=>{
        table.increments()
        table.string('nombre').notNullable()
        table.string('id_estado').notNullable()
        table.integer('id_agenda').notNullable()
        table.string('user').notNullable()
        table.dateTime('fecha').notNullable()
        table.timestamp('fecha_ins').defaultTo(knex.fn.now())
        table.timestamp('fecha_upd').defaultTo(knex.fn.now())
        table.string('user_ins')
        table.string('user_upd')
      })  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema    
    .dropTable('agendarenting_etapas')  
};
