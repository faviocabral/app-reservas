/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } id_marca
 */
exports.seed = async function(knex) {
  
  // Deletes ALL existing entries
  await knex('agendarenting_vehiculos').del()
  await knex('agendarenting_vehiculos').insert([
    { id_marca: 1, id_modelo:1, chapa: 'AAGV085', vin:'KNACB81CGM5423978', anho:2021, estado: 'Activo'},
    { id_marca: 1, id_modelo:2, chapa: 'AAGZ676', vin:'LJD0AA29BN0150565', anho:2021, estado: 'Activo'},
    { id_marca: 1, id_modelo:2, chapa: 'AAHT600', vin:'LJD0AA29BN0152796', anho:2021, estado: 'Activo'},
    { id_marca: 1, id_modelo:2, chapa: 'AAHT593', vin:'LJD0AA29BN0152789', anho:2021, estado: 'Activo'},
    { id_marca: 1, id_modelo:2, chapa: 'AAHT595', vin:'LJD0AA29BN0152734', anho:2021, estado: 'Activo'},
    { id_marca: 1, id_modelo:2, chapa: 'AAHT598', vin:'LJD0AA29BN0152731', anho:2021, estado: 'Activo'},
    { id_marca: 1, id_modelo:2, chapa: 'AAHT597', vin:'LJD0AA29BN0152799', anho:2021, estado: 'Activo'},
    { id_marca: 1, id_modelo:2, chapa: 'AAHT599', vin:'LJD0AA29BN0152748', anho:2021, estado: 'Activo'},
    { id_marca: 2, id_modelo:3, chapa: 'AAGV083', vin:'94DBCAN17MB101331', anho:2021, estado: 'Activo'},
    { id_marca: 2, id_modelo:4, chapa: 'AAGV091', vin:'94DFCAO15NB201839', anho:2022, estado: 'Activo'},
  ]);

  
};
