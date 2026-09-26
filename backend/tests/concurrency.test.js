const mongoose = require('mongoose');
require('dotenv').config();

const Competition = require('../src/models/Competition');
const User = require('../src/models/User');
const Registration = require('../src/models/Registration');
const registrationService = require('../src/services/registrationService');

async function runConcurrencyStressTest() {
  console.log('====================================================');
  console.log('   CONCURRENCY & DATA CONSISTENCY STRESS TEST');
  console.log('====================================================\n');

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedants_competition');

  // Setup: Create a test competition with total 10 spots, and 7 already booked (only 3 spots left!)
  const testComp = await Competition.create({
    title: 'Concurrency Stress Test Competition',
    prizePool: 500,
    entryFee: 50,
    maxSpots: 10,
    spotsBooked: 7, // ONLY 3 SPOTS LEFT!
    status: 'REGISTRATION_OPEN',
    dates: {
      registrationClosesAt: new Date(Date.now() + 86400000),
    },
    judge: {
      name: 'Test Judge',
      designation: 'Tester',
      experience: '5 yrs',
    },
  });

  const availableSpots = testComp.maxSpots - testComp.spotsBooked; // 3
  const concurrentUsersCount = 20; // 20 simultaneous users competing for 3 spots!

  console.log(`[Setup] Competition Created: "${testComp.title}"`);
  console.log(`[Setup] Total spots: ${testComp.maxSpots}, Already booked: ${testComp.spotsBooked}`);
  console.log(`[Setup] Available spots to claim: ${availableSpots}`);
  console.log(`[Setup] Spawning ${concurrentUsersCount} concurrent users competing for these ${availableSpots} spots...\n`);

  // Create 20 unique users
  const users = [];
  for (let i = 1; i <= concurrentUsersCount; i++) {
    const u = await User.create({
      name: `Racer User ${i}`,
      email: `racer_${Date.now()}_${i}@test.com`,
      phone: `999000${i.toString().padStart(4, '0')}`,
    });
    users.push(u);
  }

  console.log(`[Execution] Firing ${concurrentUsersCount} registration calls simultaneously via Promise.allSettled...`);
  const startTime = Date.now();

  const racePromises = users.map((user) =>
    registrationService.registerUserForCompetition({
      competitionId: testComp._id,
      userId: user._id,
      paymentDetails: {
        method: 'UPI_CONCURRENT_TEST',
        amountPaid: 50,
      },
    })
  );

  const results = await Promise.allSettled(racePromises);
  const elapsed = Date.now() - startTime;

  const successful = results.filter((r) => r.status === 'fulfilled');
  const rejected = results.filter((r) => r.status === 'rejected');

  console.log(`[Execution] All requests resolved in ${elapsed}ms.\n`);

  // Fetch verified final state from MongoDB directly
  const finalComp = await Competition.findById(testComp._id);
  const totalRegistrations = await Registration.countDocuments({ competition: testComp._id });

  console.log('---------------- RESULTS ----------------');
  console.log(`Successful Registrations: ${successful.length}`);
  console.log(`Rejected Registrations:   ${rejected.length}`);
  console.log(`Final spotsBooked in DB:  ${finalComp.spotsBooked} / ${finalComp.maxSpots}`);
  console.log(`Actual Registration docs: ${totalRegistrations} (expected: ${availableSpots})`);

  // Assertions
  let passed = true;

  if (successful.length !== availableSpots) {
    console.error(`❌ FAILED: Expected exactly ${availableSpots} successful registrations, but got ${successful.length}`);
    passed = false;
  } else {
    console.log(`✅ PASSED: Exactly ${availableSpots} users won the available spots.`);
  }

  if (finalComp.spotsBooked > finalComp.maxSpots) {
    console.error(`❌ FAILED: OVERBOOKING DETECTED! spotsBooked (${finalComp.spotsBooked}) exceeded maxSpots (${finalComp.maxSpots})`);
    passed = false;
  } else {
    console.log(`✅ PASSED: Zero overbooking! spotsBooked (${finalComp.spotsBooked}) <= maxSpots (${finalComp.maxSpots}).`);
  }

  if (totalRegistrations !== availableSpots) {
    console.error(`❌ FAILED: Registration document count mismatch.`);
    passed = false;
  } else {
    console.log(`✅ PASSED: Database document count is perfectly consistent (${totalRegistrations} created).`);
  }

  // Cleanup test documents
  await Competition.deleteOne({ _id: testComp._id });
  await User.deleteMany({ _id: { $in: users.map((u) => u._id) } });
  await Registration.deleteMany({ competition: testComp._id });

  console.log('\n[Cleanup] Test data purged.');
  console.log('====================================================');
  console.log(passed ? '🎉 CONCURRENCY TEST PASSED WITH FLYING COLORS!' : '❌ CONCURRENCY TEST FAILED');
  console.log('====================================================\n');

  await mongoose.disconnect();
  process.exit(passed ? 0 : 1);
}

runConcurrencyStressTest().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
