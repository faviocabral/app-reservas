/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('agendarenting_usuarios',(table)=>{
        table.increments()
        table.string('nombre').notNullable()
        table.string('user').notNullable()
        table.string('estado')
        table.integer('id_tipo_usuario').unsigned().references('id').inTable('agendarenting_tipo_usuarios')
        table.string('password').notNullable()
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
    .dropTable('agendarenting_usuarios')
  
};
