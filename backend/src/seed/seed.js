const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');

const seedDatabase = async () => {
  console.log('[Seed] Starting database seeding...');

  // Clear existing collections
  await Competition.deleteMany({});
  await User.deleteMany({});
  await Registration.deleteMany({});
  await Submission.deleteMany({});

  // 1. Seed Users
  const userRohan = await User.create({
    name: 'Rohan Sharma',
    email: 'rohan@feedants.com',
    phone: '9876543210',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    referralCode: 'referral123',
  });

  const userPriya = await User.create({
    name: 'Priya Patel',
    email: 'priya@feedants.com',
    phone: '9812345678',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    referralCode: 'priya456',
  });

  const userAnanya = await User.create({
    name: 'Ananya Sen',
    email: 'ananya@feedants.com',
    phone: '9845671234',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    referralCode: 'ananya789',
  });

  console.log('[Seed] Created test users: Rohan, Priya, Ananya');

  // Dynamic countdown date: exactly 1 day, 6 hours, 28 minutes, 32 seconds ahead of right now
  // to dynamically match the exact clock countdown in the design mockup!
  const dynamicCloseDate = new Date(Date.now() + (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000);

  // 2. Seed Competition
  const competition = await Competition.create({
    title: 'Feedants Classical Dance',
    category: 'Dance',
    tags: ['Dance', 'Multi-Win', 'Winners get certificate'],
    prizePool: 1500,
    entryFee: 99,
    maxSpots: 20,
    spotsBooked: 1, // 1/20 Booked -> "Only 19 spots left"
    status: 'REGISTRATION_OPEN',
    isActive: true,
    judge: {
      name: 'Manju Dubey',
      role: 'Judge',
      designation: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      bio: 'Manju Dubey is an accomplished Kathak maestro with over 12 years of performance, choreography, and teaching experience at premier academies across India.',
    },
    dates: {
      registrationClosesAt: dynamicCloseDate,
      registerBefore: {
        dateStr: '10 Aug 26',
        timeStr: '11:50 PM',
        timestamp: new Date('2026-08-10T23:50:00.000Z'),
      },
      submissionStarts: {
        dateStr: '6 Aug 26',
        timeStr: '04:00 AM',
        timestamp: new Date('2026-08-06T04:00:00.000Z'),
      },
      submissionEnds: {
        dateStr: '30 Aug 26',
        timeStr: '11:55 PM',
        timestamp: new Date('2026-08-30T23:55:00.000Z'),
      },
      resultDate: {
        dateStr: '1 Sept 26',
        timeStr: '11:50 PM',
        timestamp: new Date('2026-09-01T23:50:00.000Z'),
      },
    },
    previousWinners: [
      {
        name: 'Riya Shah',
        position: '1st Winner',
        avatarUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        style: 'Kathak Solo',
      },
      {
        name: 'Aarav Mehta',
        position: '1st Winner',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        style: 'Bharatanatyam Tarana',
      },
      {
        name: 'Neha Verma',
        position: '2nd Winner',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        style: 'Odissi Pallavi',
      },
      {
        name: 'Ishita Chouhan',
        position: '3rd Winner',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        style: 'Kathak Thumri',
      },
    ],
    tabs: {
      about: {
        shortEn: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
        fullEn: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.\n\nWhether you practice Kathak, Bharatanatyam, Odissi, Kuchipudi, or any recognized Indian classical style, this competition provides a distinguished platform to be evaluated by maestro Manju Dubey. Record your solo or duet routine in high definition, upload your performance video, and compete for verified certificates and a share of the ₹1,500 prize pool.',
        shortHi: 'यह सभी आयु समूहों के लिए खुली एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है। कहीं से भी भाग लें और अपनी प्रतिभा दिखाएं। पारंपरिक नृत्य के माध्यम से अपने जुनून को व्यक्त करें।',
        fullHi: 'यह सभी आयु समूहों के लिए खुली एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है। कहीं से भी भाग लें और अपनी प्रतिभा दिखाएं।\n\nचाहे आप कथक, भरतनाट्यम, ओडिसी, या कुचिपुड़ी का अभ्यास करते हों, यह प्रतियोगिता प्रसिद्ध नृत्यांगना मंजू दुबे द्वारा मूल्यांकन का एक उत्कृष्ट मंच प्रदान करती है। अपने प्रदर्शन का वीडियो अपलोड करें और प्रमाणपत्र व ₹1,500 पुरस्कार राशि जीतें।',
      },
      judgingParameters: [
        {
          title: 'Rhythm & Taal (ताल व लय)',
          weight: '30%',
          description: 'Precision in footwork (Tatkar), adherence to laya, and clarity of rhythmic bols.',
        },
        {
          title: 'Abhinaya & Expression (भाव व अभिनय)',
          weight: '25%',
          description: 'Authentic emotional depiction (Navarasa), eye coordination (Drishti bheda), and storytelling.',
        },
        {
          title: 'Technique & Mudras (हस्तमुद्रा व अंगशुद्धि)',
          weight: '25%',
          description: 'Purity of classical posture, geometric arm lines, and distinct hand gestures.',
        },
        {
          title: 'Stage Presence & Costume (वेशभूषा व प्रस्तुति)',
          weight: '20%',
          description: 'Authentic traditional classical attire, ghungroos, stage grace, and overall visual harmony.',
        },
      ],
      rulesAndEligibility: [
        'Open to all age groups across India and globally.',
        'Original solo or duet classical dance performances only (Kathak, Bharatanatyam, Odissi, Kuchipudi, etc.).',
        'Video recording must be 2 to 5 minutes duration, filmed in landscape mode with clear audio and lighting.',
        'Continuous single-take recording is preferred; heavy video effects or auto-sync editing are prohibited.',
        'Entries must be submitted prior to the deadline: 30 Aug 26, 11:55 PM.',
        'Decisions of the judge (Manju Dubey) and Feedants moderation panel are final and binding.',
      ],
    },
    rewards: [
      { rank: 1, title: '1st Winner', amount: 550, iconType: 'trophy' },
      { rank: 2, title: '2nd Winner', amount: 300, iconType: 'medal' },
      { rank: 3, title: '3rd Winner', amount: 240, iconType: 'medal' },
      { rank: 4, title: '4th Winner', amount: 200, iconType: 'star' },
      { rank: 5, title: '5th Winner', amount: 130, iconType: 'star' },
      { rank: 6, title: '6th Winner', amount: 80, iconType: 'star' },
    ],
    disclaimer: 'Disclaimer: Only contributions from paid participants will be considered for judging.',
    referral: {
      bonusPerSignup: 10,
      slug: 'referral123',
    },
  });

  console.log(`[Seed] Created Competition: ${competition.title} (ID: ${competition._id})`);

  // 3. Register Rohan as the 1st participant (matches "1 / 20 Booked", "Only 19 spots left" & "Registered" state in mockup!)
  const registrationRohan = await Registration.create({
    competition: competition._id,
    user: userRohan._id,
    slotNumber: 1,
    status: 'REGISTERED',
    payment: {
      paymentId: 'pay_rzp_demo_live123',
      orderId: 'order_feedants_101',
      amountPaid: 99,
      currency: 'INR',
      method: 'Razorpay UPI',
      status: 'SUCCESS',
      paidAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    },
    registeredAt: new Date(Date.now() - 3600000 * 2),
  });

  console.log('[Seed] Registered user Rohan Sharma in Slot #1');

  console.log('[Seed] Database seeding completed successfully.');
  return {
    competitionId: competition._id,
    users: {
      rohan: userRohan._id,
      priya: userPriya._id,
      ananya: userAnanya._id,
    },
    registrationId: registrationRohan._id,
  };
};

// If run directly from CLI
if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../config/db');

  connectDB().then(async () => {
    try {
      await seedDatabase();
      console.log('Seed CLI execution complete.');
      process.exit(0);
    } catch (err) {
      console.error('Seed CLI error:', err);
      process.exit(1);
    }
  });
}

module.exports = seedDatabase;
