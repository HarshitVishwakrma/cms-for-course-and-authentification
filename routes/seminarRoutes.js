const express = require('express');

const router = express.Router();

const seminarController = require('../controller/seminarController');
const authController = require('../controller/authController')

router.get('/seminars', seminarController.getSeminars);
router.post('/seminar', seminarController.addSeminars);
router.delete('/seminar/:seminarId',authController.authenticateUser, seminarController.deleteSeminars);
router.put('/seminar/:seminarId',authController.authenticateUser, seminarController.updateSeminars)

module.exports = router;