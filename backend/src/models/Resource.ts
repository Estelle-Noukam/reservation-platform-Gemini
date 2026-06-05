import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Booking } from './Booking';

@Table({ tableName: 'resources' })
export class Resource extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type!: string; // 'room', 'equipment', 'service'

  @Column({ type: DataType.TEXT, allowNull: true })
  description!: string;

  @HasMany(() => Booking)
  bookings!: Booking[];
}
