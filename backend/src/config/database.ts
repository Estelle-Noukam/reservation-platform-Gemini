import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { Resource } from '../models/Resource';
import { Booking } from '../models/Booking';

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'booking_system',
  dialect: 'postgres',
  username: process.env.DB_USER || 'booking_user',
  password: process.env.DB_PASSWORD || 'booking_password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  models: [User, Resource, Booking],
  logging: false,
});

export default sequelize;
