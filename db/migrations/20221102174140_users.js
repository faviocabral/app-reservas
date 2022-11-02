/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('agendarenting_estados', (table)=>{
        table.increments()
        table.string('nombre').notNullable()
        table.timestamp('fecha_ins').defaultTo(knex.fn.now())
        table.timestamp('fecha_upd').defaultTo(knex.fn.now())
        table.string('user_ins')
        table.string('user_upd')
      })
      .createTable('agendarenting_tipo_usuarios', (table)=>{
        table.increments()
        table.string('nombre').notNullable()
        table.string('estado')
        table.timestamp('fecha_ins').defaultTo(knex.fn.now())
        table.timestamp('fecha_upd').defaultTo(knex.fn.now())
        table.string('user_ins')
        table.string('user_upd')
      })
      .createTable('agendarenting_usuarios',(table)=>{
        table.increments()
        table.string('nombre').notNullable()
        table.string('estado')
        table.integer('id_tipo_usuario').unsigned().references('id').inTable('agendarenting_tipo_usuarios')
        table.string('password').notNullable()
        table.timestamp('fecha_ins').defaultTo(knex.fn.now())
        table.timestamp('fecha_upd').defaultTo(knex.fn.now())
        table.string('user_ins')
        table.string('user_upd')
      })
      .createTable('agendarenting_marcas', (table)=>{
        table.increments()
        table.string('nombre').notNullable()
        table.string('estado')
        table.timestamp('fecha_ins').defaultTo(knex.fn.now())
        table.timestamp('fecha_upd').defaultTo(knex.fn.now())
        table.string('user_ins')
        table.string('user_upd')
      })
      .createTable('agendarenting_modelos', (table)=>{
        table.increments()
        table.string('nombre').notNullable()
        table.string('estado')
        table.timestamp('fecha_ins').defaultTo(knex.fn.now())
        table.timestamp('fecha_upd').defaultTo(knex.fn.now())
        table.string('user_ins')
        table.string('user_upd')
      })
      .createTable('agendarenting_talleres', (table)=>{
        table.increments()
        table.string('nombre').notNullable()
        table.string('estado')
        table.timestamp('fecha_ins').defaultTo(knex.fn.now())
        table.timestamp('fecha_upd').defaultTo(knex.fn.now())
        table.string('user_ins')
        table.string('user_upd')
      })
      .createTable('agendarenting_vehiculos', (table)=>{
        table.increments()
        table.string('nombre').notNullable()
        table.string('estado')
        table.string('vin').notNullable()
        table.string('chapa').notNullable()
        table.integer('id_marca').unsigned().references('id').inTable('agendarenting_marcas')
        table.integer('id_modelo').unsigned().references('id').inTable('agendarenting_modelos')
        table.integer('id_taller').unsigned().references('id').inTable('agendarenting_talleres')
        table.timestamp('fecha_ins').defaultTo(knex.fn.now())
        table.timestamp('fecha_upd').defaultTo(knex.fn.now())
        table.string('user_ins')
        table.string('user_upd')
      })
      .createTable('agendarenting_agenda', (table)=>{
        table.increments()
        table.string('codigo_cliente').notNullable()
        table.string('nombre_cliente').notNullable()
        table.string('titulo')
        table.integer('id_estado').unsigned().references('id').inTable('agendarenting_estados')
        table.integer('id_taller').unsigned().references('id').inTable('agendarenting_talleres')
        table.string('estado')
        table.timestamp('fecha_ins').defaultTo(knex.fn.now())
        table.timestamp('fecha_upd').defaultTo(knex.fn.now())
        table.string('user_ins')
        table.string('user_upd')
      })
      .createTable('agendarenting_detalles', (table)=>{
        table.increments()
        table.string('nombre')
        table.integer('id_vehiculo').unsigned().references('id').inTable('agendarenting_vehiculos')
        table.string('estado')
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
        .dropTable('agendarenting_estados')
        .dropTable('agendarenting_tipo_usuarios')
        .dropTable('agendarenting_usuarios')
        .dropTable('agendarenting_marcas')
        .dropTable('agendarenting_modelos')
        .dropTable('agendarenting_talleres')
        .dropTable('agendarenting_vehiculos')
        .dropTable('agendarenting_agenda')
        .dropTable('agendarenting_detalles')
};
  