/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agendarenting_usuarios').del()
  await knex('agendarenting_usuarios').insert([
    { nombre: 'Administrador' , user: 'admin' , password: '$2a$12$D.TE9JGNbHC/dzzj/HUzIuHlgGab8eeFO6H3F0lKgbYg6rqlewi4S'},
  ]);
};
