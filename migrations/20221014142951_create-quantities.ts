import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const quantityTable = await knex.schema.hasTable("user_food_category");
    if (!quantityTable) {
        await knex.schema.createTable("user_food_category", (table) => {
            table.increments();
            table.integer("user_id").unsigned();
            table.foreign("user_id").references("users.id");
            table.integer("category_id").unsigned();
            table.foreign("category_id").references("food_categories.id");
            table.timestamps(false, true);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("user_food_category");
}