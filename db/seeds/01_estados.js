/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agendarenting_estados').del()
  await knex('agendarenting_estados').insert([
    {nombre: 'Agendado'},
    {nombre: 'Entregado'},
    {nombre: 'Recibido'},
    {nombre: 'Cancelado'},
  ]);
};
