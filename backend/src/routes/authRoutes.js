const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // authController 임포트

// 회원가입 라우트
router.post('/join', authController.register);

// 로그인 라우트
router.post('/login', authController.login);

module.exports = router;
