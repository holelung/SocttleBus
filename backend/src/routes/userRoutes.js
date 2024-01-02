const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 마이페이지 유저정보 불러오기
router.get('/getUser', userController.getUser);

module.exports = router;