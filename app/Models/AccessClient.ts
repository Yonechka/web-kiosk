import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AccessClient extends BaseModel {
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column({ isPrimary: true })
  public client_id: String

  @column()
  public client_secret: String

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public version_endpoint: String

  @column()
  public url_identifier: string;
}
