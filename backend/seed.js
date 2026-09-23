require('dotenv').config();
const mongoose = require('mongoose');
const Competition = require('./src/models/Competition');
const User = require('./src/models/User');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Competition.deleteMany({});
  await User.deleteMany({});

  const now = new Date();
  const comp = await Competition.create({
    title: 'Feedants Classical Dance',
    tags: ['Dance', 'Multi-Win'],
    category: 'Dance',
    prizePool: 1500,
    entryFee: 99,
    totalSpots: 20,
    bookedSpots: 1,
    winnersGetCertificate: true,
    judge: {
      name: 'Manju Dubey',
      photoUrl: 'https://picsum.photos/seed/judge/200',
      credentials: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      introVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    registrationOpenDate:   new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    registrationCloseDate:  new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    submissionStartDate:    new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    submissionEndDate:      new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
    resultDate:             new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    about: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
    judgingParameters: 'Technique, Expression, Costumes, Stage Presence, Timing',
    rulesAndEligibility: 'Open to all age groups. Submit a video between 3-5 minutes. Only one submission allowed per participant.',
    rewards: [
      { position: 1, label: '1st Winner', amount: 550 },
      { position: 2, label: '2nd Winner', amount: 300 },
      { position: 3, label: '3rd Winner', amount: 240 },
      { position: 4, label: '4th Winner', amount: 200 },
      { position: 5, label: '5th Winner', amount: 130 },
      { position: 6, label: '6th Winner', amount: 80 },
    ],
    winners: [
      { name: 'Riya Shah',   position: 1, videoUrl: '', photoUrl: 'https://picsum.photos/seed/w1/200' },
      { name: 'Aarav Mehta', position: 1, videoUrl: '', photoUrl: 'https://picsum.photos/seed/w2/200' },
      { name: 'Neha Verma',  position: 2, videoUrl: '', photoUrl: 'https://picsum.photos/seed/w3/200' },
      { name: 'Ishita Cho',  position: 3, videoUrl: '', photoUrl: 'https://picsum.photos/seed/w4/200' },
    ],
  });

  const user = await User.create({
    name: 'Atharv Khunte',
    email: 'atharv@test.com',
    password: 'password123',
    phone: '+91-8329564345',
  });

  console.log('Seeded! Competition ID:', comp._id);
  console.log('Test user: atharv@test.com / password123');
  await mongoose.disconnect();
}

seed().catch(console.error);