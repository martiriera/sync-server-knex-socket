
exports.up = function(knex) {
    return knex.schema.createTable('category', function (table) {
        table.increments();
        table.string('name');
        table.timestamp('lastUpdate').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('category');
};
