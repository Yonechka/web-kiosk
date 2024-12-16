import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ApiTokens extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public client_id: String

  @column()
  public token: String

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public expires_at: DateTime
  
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public created_at: DateTime
}
