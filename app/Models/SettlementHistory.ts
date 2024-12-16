import { DateTime, DateInput } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SettlementHistory extends BaseModel {
  static table = 'settlement_history'
  @column({ isPrimary: true })
  public id: Number

  @column()
  public kiosk_id: String

  @column()
  public message: String

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
