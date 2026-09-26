const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');

router.get('/', competitionController.getAllCompetitions);
router.get('/:id', competitionController.getCompetitionDetails);
router.patch('/:id/state', competitionController.updateCompetitionState);
router.post('/:id/reset', competitionController.resetCompetition);

module.exports = router;
