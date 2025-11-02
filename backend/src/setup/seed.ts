import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

export async function seedDemo() {
  const coachEmail = 'male@coach.local';
  const athleteEmail = 'male@athlete.local';
  const femaleAthlete = 'female@athlete.local'
  const adminEmail = 'bishal@admin.local';

  const coach = await User.findOne({ email: coachEmail });
  if (!coach) {
    await User.create({
      name: 'Demo Coach',
      email: coachEmail,
      role: 'Coach',
      gender: 'male',
      teamId: undefined,
      passwordHash: await bcrypt.hash('demo', 10),
    });
    // eslint-disable-next-line no-console
    console.log('Seeded demo coach');
  }

  const athlete = await User.findOne({ email: athleteEmail });
  if (!athlete) {
    await User.create({
      name: 'Male Athlete',
      email: athleteEmail,
      role: 'Athlete',
      gender: 'male',

      teamId: undefined,
      passwordHash: await bcrypt.hash('demo', 10),
    });
    await User.create({
      name: 'Female Athlete',
      email: femaleAthlete,
      role: 'Athlete',
      gender: 'female',

      teamId: undefined,
      passwordHash: await bcrypt.hash('demo', 10),
    });
    // eslint-disable-next-line no-console
    console.log('Seeded demo athlete');
  }

  const admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    await User.create({
      name: 'Admin User',
      email: adminEmail,
      role: 'Admin',
      gender: 'male',
      teamId: undefined,
      passwordHash: await bcrypt.hash('admin', 10),
    });
    // eslint-disable-next-line no-console
    console.log('Seeded admin user: bishal@admin.com');
  }
}
