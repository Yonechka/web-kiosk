import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  public async up () {
    this.schema.alterTable('access_clients', (table) => {
      table.string('version_endpoint').defaultTo('asmat');
    })
  }

  public async down () {
    this.schema.dropTable('access_client')
  }
}
