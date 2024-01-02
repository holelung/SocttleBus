const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// 예약 생성
router.post('/makeReservation', reservationController.makeReservation);

// 예약 불러오기
router.get('/getReservation', reservationController.getReservation);

module.exports = router;