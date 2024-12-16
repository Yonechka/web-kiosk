import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AccessClient from 'App/Models/AccessClient'
import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  public async run () {
    const hashedSecret = await Hash.make('ASMAT_KIOSK');
    await AccessClient.createMany([
      {
        client_id: 'ASMAT',
        client_secret: hashedSecret,
        url_identifier: 'baraya',
        version_endpoint: 'asmatNew'
      }
    ])
  }
}
