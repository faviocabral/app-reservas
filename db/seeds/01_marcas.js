/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agendarenting_marcas').del()
  await knex('agendarenting_marcas').insert([
    {nombre: 'RENTING - KIA' , estado:'Activo'},
    {nombre: 'RENTING - NISSAN' , estado:'Activo'},

  ]);
};
