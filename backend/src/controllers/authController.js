// 로그인, 회원가입 등 인증관련 기능

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getConnection = require('../config/dbConfig'); // 데이터베이스 설정을 불러옵니다.

const SECRET_KEY = 'I_AM_GOD'; // JWT 시크릿 키

// 회원가입 함수
exports.register = async (req, res, next) => {
    const { userId, password, name } = req.body;

    if (!userId || !password || !name) {
        return res.status(400).send({ message: '아이디, 비밀번호, 이름을 모두 입력해야 합니다.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = getConnection();

        connection.query('INSERT INTO Students (StudentNumber, Password, StudentName) VALUES (?, ?, ?)', 
            [userId, hashedPassword, name], 
            (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send({ message: '사용자 등록 중 오류가 발생했습니다.', error });
                }
                return res.status(201).send({ message: '사용자 등록이 성공적으로 완료되었습니다.' });
            }
        );

        connection.end();
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: '서버 오류가 발생했습니다.', error });
    }
};

// 로그인 함수
exports.login = async (req, res, next) => {
    const { userId, password } = req.body;

    // 공백일 경우 체크
    if (!userId || !password) {
        return res.status(400).send({ message: '아이디와 비밀번호를 입력해야 합니다.' });
    }

    try {
        const connection = getConnection();

        connection.query('SELECT * FROM Students WHERE StudentNumber = ?', 
            [userId], 
            async (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send({ message: '로그인 중 오류가 발생했습니다.', error });
                }

                if (results.length > 0) {
                    const comparison = await bcrypt.compare(password, results[0].Password);
                    if (comparison) {
                        const token = jwt.sign({
                            // 유저 정보 확인시 필요
                            userNum: results[0].StudentNumber,
                            // 예약 테이블 확인시 필요
                            userID: results[0].StudentID
                        }, SECRET_KEY);
                        return res.status(200).json({ token, message: '로그인 성공!' });
                    } else {
                        return res.status(401).send({ message: '로그인 실패: 패스워드가 잘못되었습니다.' });
                    }
                } else {
                    return res.status(401).send({ message: '로그인 실패: 사용자를 찾을 수 없습니다.' });
                }
            }
        );

        connection.end();
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: '서버 오류가 발생했습니다.', error });
    }
};
