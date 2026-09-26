const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.post('/', registrationController.register);
router.get('/:competitionId/user/:userId', registrationController.getUserRegistration);
router.post('/simulate-concurrency', registrationController.simulateConcurrentRegistrations);

module.exports = router;
