const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // JWT 시크릿 키

const app = express(); // express server

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "335276",
    database: "shuttle_bus",
})

app.get("/", function (req, res) {
  res.send("안녕하세요!");
});

//회원가입
app.post('/api/join', async (req, res) => {
    const { userId, password, name } = req.body;
    if (!userId || !password || !name) {
        return res.status(400).send({ message: '아이디, 비밀번호, 이름을 모두 입력해야 합니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO Students (StudentNumber, Password, Name) VALUES (?, ?, ?)', [userId, hashedPassword, name], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ message: '사용자 등록 중 오류가 발생했습니다.', error });
        }
        return res.status(201).send({ message: '사용자 등록이 성공적으로 완료되었습니다.' });
    });
});

//로그인
app.post('/api/login', async (req, res) => {
    const { userId, password } = req.body;
    // 사용자를 찾고, 패스워드를 검증합니다.
    db.query('SELECT * FROM Students WHERE StudentNumber = ?', [userId], async (error, results) => {
        if (results.length > 0) {
            const comparison = await bcrypt.compare(password, results[0].password);
            if (comparison) {
                const token = jwt.sign({ username: results[0].id }, SECRET_KEY);
                
                return res.status(200).json({ token, message: '로그인 성공!'});
            } else {
                return res.status(401).send({ message: '로그인 실패: 패스워드가 잘못되었습니다.' });
            }
        }
        if(error){
            return res.status(401).send({ message: '로그인 실패: 사용자를 찾을 수 없습니다.' });
        }
 
    });
});

app.post('/api/logout', (req, res) => {
  // 클라이언트에게 토큰을 삭제하라는 응답을 보냅니다.

  // 실제로는 JWT 토큰을 서버 측에서 관리하고 있다면 여기에서 블랙리스트 처리를 할 수 있습니다.
  res.status(200).send({ message: '로그아웃 요청 받음. 클라이언트에서 토큰을 삭제해야 합니다.' });
});

//유저 정보 받아서 보내기
app.get('/api/getuser', (req, res) => {
    // token 받아와서 유저 테이블
    const user = authenticateRequest(req);
    console.log(user);

    db.query('SELECT * FROM Students WHERE StudentNumber = ?', user.username, async (error, results) => {
        if(results.length > 0){
            //유저 정보 전부 리턴
            console.log(results[0]);
            return res.status(200).json({ userId: results[0].id, userName: results[0].name });
        }
        if(error){
            
            return res.status(401).send({ message: "유저 정보 없음"})
        }
    });
});

// 인증 함수(JWT 사용)
function authenticateRequest(req) {
  // 요청 헤더에서 토큰을 추출합니다.
  const token = req.headers.authorization?.split(' ')[1]; // Bearer 토큰
  if (!token) {
    return null;
  }
  
  try {
    // JWT 토큰을 검증하고 페이로드를 반환합니다.
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}



app.listen(3001, () => {
  console.log("Server is running onn port 3001");
});


