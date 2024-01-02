// 유저 정보 조회 관련기능

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getConnection = require('../config/dbConfig');
const authReq = require('../utils/authReq');

exports.getUser = async (req, res, next) => {
    // jwt token으로 유저 정보 확인
    const test = req.headers;
    // jwt token 복호화
    const user = authReq.authenticateRequest(req);
    console.log(user);
    try {
        const connection = getConnection();
        connection.query('SELECT * FROM Students WHERE StudentNumber = ?', user.userNum, async (error, results) => {
            if(results.length > 0){
                console.log(results[0]);
                
                return res.status(200).json({ 
                    userId: results[0].StudentNumber,
                    userName: results[0].StudentName 
                });
            }
            if(error){
                return res.status(401).send({ message: "유저 정보를 찾을 수 없음"});
            }
        })

    }catch(error){
        console.error(error);
    }
};

