/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agendarenting_talleres').del()
  await knex('agendarenting_talleres').insert([
    {nombre: 'taller kia la victoria' , estado: 'activo'},
    {nombre: 'taller fca' , estado: 'activo'},
    {nombre: 'taller mariano multimarca' , estado: 'activo'},
    {nombre: 'taller nissan mcal lopez' , estado: 'activo'},
    {nombre: 'taller missan fernando de la mora' , estado: 'activo'},
    {nombre: 'taller tema automotores' , estado: 'activo'},
  ]);
};
