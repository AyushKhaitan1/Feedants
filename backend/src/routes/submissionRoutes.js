const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

router.post('/', submissionController.createSubmission);
router.get('/:competitionId/user/:userId', submissionController.getUserSubmission);

module.exports = router;
