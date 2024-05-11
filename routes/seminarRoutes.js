const express = require('express');

const router = express.Router();

const seminarController = require('../controller/seminarController');
const authController = require('../controller/authController')
const Seminar = require('../model/seminar')

router.get('/seminars', seminarController.getSeminars);
router.post('/seminar',authController.authenticateUser ,Seminar.uploadPreviewImage, seminarController.addSeminars);
router.delete('/seminar/:seminarId',authController.authenticateUser, seminarController.deleteSeminars);
router.put('/seminar/:seminarId',authController.authenticateUser, seminarController.updateSeminars)

module.exports = router;