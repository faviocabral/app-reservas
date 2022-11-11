/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } id_marca
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agendarenting_vehiculos').del()
  await knex('agendarenting_vehiculos').insert([
    { id_marca: 9, id_modelo:17, chapa: 'AAGV085', vin:'KNACB81CGM5423978', anho:2021, estado: 'Activo'},
    { id_marca: 9, id_modelo:18, chapa: 'AAGZ676', vin:'LJD0AA29BN0150565', anho:2021, estado: 'Activo'},
    { id_marca: 9, id_modelo:18, chapa: 'AAHT600', vin:'LJD0AA29BN0152796', anho:2021, estado: 'Activo'},
    { id_marca: 9, id_modelo:18, chapa: 'AAHT593', vin:'LJD0AA29BN0152789', anho:2021, estado: 'Activo'},
    { id_marca: 9, id_modelo:18, chapa: 'AAHT595', vin:'LJD0AA29BN0152734', anho:2021, estado: 'Activo'},
    { id_marca: 9, id_modelo:18, chapa: 'AAHT598', vin:'LJD0AA29BN0152731', anho:2021, estado: 'Activo'},
    { id_marca: 9, id_modelo:18, chapa: 'AAHT597', vin:'LJD0AA29BN0152799', anho:2021, estado: 'Activo'},
    { id_marca: 9, id_modelo:18, chapa: 'AAHT599', vin:'LJD0AA29BN0152748', anho:2021, estado: 'Activo'},
    { id_marca: 10, id_modelo:19, chapa: 'AAGV083', vin:'94DBCAN17MB101331', anho:2021, estado: 'Activo'},
    { id_marca: 10, id_modelo:20, chapa: 'AAGV091', vin:'94DFCAO15NB201839', anho:2022, estado: 'Activo'},
  ]);
};
