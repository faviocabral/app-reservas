/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agendarenting_tipo_usuarios').del()
  await knex('agendarenting_tipo_usuarios').insert([
    { nombre: 'Administrador' , estado: 'Activo'},
    { nombre: 'Gerente Taller' , estado: 'Activo'},
    { nombre: 'Asesor' , estado: 'Activo'},
    { nombre: 'Call Center' , estado: 'Activo'},
  ]);
};
