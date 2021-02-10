
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('category').del()
    .then(function () {
      // Inserts seed entries
      return knex('category').insert([
        {id: 1, name: 'bakery', lastUpdate: 'NOW()'},
        {id: 2, name: 'dairy', lastUpdate: 'NOW()'},
        {id: 3, name: 'fruitVeg', lastUpdate: 'NOW()'},
        {id: 4, name: 'meats', lastUpdate: 'NOW()'},
      ]);
    });
};
