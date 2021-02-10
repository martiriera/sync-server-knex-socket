
exports.up = function(knex) {
    return knex.schema.createTable('product', function (table) {
        table.increments();
        table.string('name');
        table.float('price');
        table.string('description');
        table.timestamp('lastUpdate').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('product');
};
