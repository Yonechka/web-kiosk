import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'add_url_identifier_field_to_access_client_tables'

  public async up () {
    this.schema.alterTable('access_clients', (table) => {
      table.string('url_identifier').nullable();
    })
  }

  public async down () {
    // this.schema.dropTable(this.tableName)
  }
}
