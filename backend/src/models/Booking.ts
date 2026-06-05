import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Resource } from './Resource';

@Table({ tableName: 'bookings' })
export class Booking extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Resource)
  @Column({ type: DataType.UUID, allowNull: false })
  resourceId!: string;

  @BelongsTo(() => Resource)
  resource!: Resource;

  @Column({ type: DataType.DATE, allowNull: false })
  startTime!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  endTime!: Date;

  @Column({ type: DataType.ENUM('confirmed', 'cancelled'), defaultValue: 'confirmed', allowNull: false })
  status!: 'confirmed' | 'cancelled';
}
