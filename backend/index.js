const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');


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

app.post('/api/join', async (req, res) => {
    const { userId, password, name } = req.body;
    if (!userId || !password || !name) {
        return res.status(400).send({ message: '아이디, 비밀번호, 이름을 모두 입력해야 합니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO user (id, password, name) VALUES (?, ?, ?)', [userId, hashedPassword, name], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ message: '사용자 등록 중 오류가 발생했습니다.', error });
        }
        return res.status(201).send({ message: '사용자 등록이 성공적으로 완료되었습니다.' });
    });
});


app.post('/api/login', async (req, res) => {
    const { userId, password } = req.body;
    // 사용자를 찾고, 패스워드를 검증합니다.
    db.query('SELECT * FROM user WHERE id = ?', [userId], async (error, results) => {
        if (results.length > 0) {
            const comparison = await bcrypt.compare(password, results[0].password);
            if (comparison) {
                return res.status(200).send({ message: '로그인 성공!' });
            }
        }
        if(error){
            console.error(error);
            return res.status(401).send({ message: '로그인 실패: 사용자 이름이나 패스워드가 잘못되었습니다.' });
        }
        
 
    });
});

app.listen(3001, () => {
  console.log("Server is running onn port 3001");
});


