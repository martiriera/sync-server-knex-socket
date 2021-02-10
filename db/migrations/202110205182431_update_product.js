exports.up = function (knex, Promise) {
    return knex.schema.table('product', function (table) {
        table.integer('category');
        table.foreign('category')
            .references('category.id')
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('product', function (table) {
        table.dropForeign('category');
    });
};