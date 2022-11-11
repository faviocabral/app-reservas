/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agendarenting_modelos').del()
  await knex('agendarenting_modelos').insert([
    {nombre: 'NIRO' , estado:'Activo'},
    {nombre: 'SOLUTO' , estado:'Activo'},
    {nombre: 'VERSA DRIVE' , estado:'Activo'},
    {nombre: 'KICKS' , estado:'Activo'},
  ]);
};
