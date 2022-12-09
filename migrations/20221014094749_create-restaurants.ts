import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const restaurantTable = await knex.schema.hasTable("restaurants");
    if (!restaurantTable) {
        await knex.schema.createTable("restaurants", (table) => {
            table.increments();
            table.string("name");
            table.string("address");
            table.string("shop_photo");
            table.integer("like_count");
            table.integer("dislike_count");
            table.string("phone");
            table.point("coordinates")
            table.integer("district_id").unsigned();
            table.foreign("district_id").references("districts.id");
            table.integer("category_id").unsigned();
            table.foreign("category_id").references("food_categories.id");
            table.integer("price_range_id").unsigned();
            table.foreign("price_range_id").references("price_ranges.id");
            table.timestamps(false, true);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("restaurants");
}