const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// 예약 선택화면 불러오기
router.post('/getSeats', seatController.getSeats);

router.post('/changeIsReserved', seatController.changeIsReserved);

module.exports = router;