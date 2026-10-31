require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const Training = require('./models/Training');

async function seed() {
  await connectDB();
  const password = await bcrypt.hash('StaffSync123!', 12);
  const users = [
    { name: 'Aarav Sharma', email: 'hr@staffsync.demo', role: 'HR', department: 'Human Resources', jobTitle: 'HR Administrator' },
    { name: 'Priya Verma', email: 'manager@staffsync.demo', role: 'Manager', department: 'Engineering', jobTitle: 'Engineering Manager' },
    { name: 'Rohan Patel', email: 'employee@staffsync.demo', role: 'Employee', department: 'Engineering', jobTitle: 'Software Engineer' }
  ];
  for (const u of users) await User.updateOne({ email: u.email }, { $set: { ...u, password, active: true } }, { upsert: true });
  const hr = await User.findOne({ email: 'hr@staffsync.demo' });
  if (await Announcement.countDocuments() === 0) {
    await Announcement.create({ title: 'Welcome to StaffSync', body: 'Please keep your employee profile up to date. Contact HR if you need help.', author: hr._id });
  }
  if (await Training.countDocuments() === 0) {
    await Training.create([
      { title: 'Workplace Communication', description: 'Practical communication skills for teams.', seats: 30 },
      { title: 'Cybersecurity Basics', description: 'Learn safe password and data handling practices.', seats: 25 }
    ]);
  }
  console.log('Seed complete. Demo password: StaffSync123!');
  await mongoose.disconnect();
}
seed().catch(err => { console.error(err); process.exit(1); });
