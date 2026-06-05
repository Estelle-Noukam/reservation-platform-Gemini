import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Booking } from './Booking';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.ENUM('user', 'admin'), defaultValue: 'user', allowNull: false })
  role!: 'user' | 'admin';

  @HasMany(() => Booking)
  bookings!: Booking[];
}
