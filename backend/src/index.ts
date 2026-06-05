import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import authRoutes from './routes/auth.routes';
import resourceRoutes from './routes/resource.routes';
import bookingRoutes from './routes/booking.routes';
import { User } from './models/User';
import { Resource } from './models/Resource';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);

const seedDatabase = async () => {
  const adminExists = await User.findOne({ where: { email: 'admin@booking.com' } });
  if (!adminExists) {
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@booking.com',
      password: hashedAdminPassword,
      name: 'System Admin',
      role: 'admin'
    });

    const hashedUserPassword = await bcrypt.hash('user123', 10);
    await User.create({
      email: 'user@booking.com',
      password: hashedUserPassword,
      name: 'John Doe',
      role: 'user'
    });

    await Resource.bulkCreate([
      { name: 'Conf Room Alpha', type: 'room', description: '8-person meeting room with projector' },
      { name: 'Conf Room Beta', type: 'room', description: '4-person focus room' },
      { name: 'MacBook Pro 16"', type: 'equipment', description: 'M3 Max development laptop' },
      { name: '4K Projector', type: 'equipment', description: 'Portable high-definition projector' }
    ]);
  }
};

sequelize.sync({ alter: true }).then(() => {
  seedDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server executing on port ${PORT}`);
    });
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});
