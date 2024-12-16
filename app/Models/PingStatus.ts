import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PingStatus extends BaseModel {
  static table = 'ping_status';

  @column({ isPrimary: true })
  public id: number

  @column()
  public client_id: String

  @column()
  public outlet: String;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
  
  @column.dateTime({ autoCreate: true })
  public created_at: DateTime
}
