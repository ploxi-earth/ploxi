/**
 * seed-users.js
 * Run once to create / reset admin and vendor credentials.
 * Usage:  node seed-users.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User.model');

const USERS = [
  {
    name: 'Platform Admin',
    email: 'admin@ploxi.earth',
    password: 'Admin@2026!',
    role: 'platform_admin',
  },
  {
    name: 'Vendor User',
    email: 'vendor@ploxi.earth',
    password: 'Vendor@2026!',
    role: 'vendor',
  },
  {
    name: 'Consultant User',
    email: 'consultant@ploxi.earth',
    password: 'Consultant@2026!',
    role: 'consultant',
  },
  {
    name: 'Manager User',
    email: 'manager@ploxi.earth',
    password: 'Manager@2026!',
    role: 'manager',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB\n');

  for (const u of USERS) {
    const hashed = await bcrypt.hash(u.password, 12);

    const result = await User.findOneAndUpdate(
      { email: u.email },
      {
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: false }
    );

    console.log(`  ${result._id ? '🔄 Updated' : '🆕 Created'}  [${u.role.padEnd(16)}]  ${u.email}  →  password: ${u.password}`);
  }

  console.log('\n✅  Done. Use the credentials above to log in.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
