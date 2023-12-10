const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const schedule = require('node-schedule');
const moment = require('moment-timezone');

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
            const comparison = await bcrypt.compare(password, results[0].Password);
            if (comparison) {
                const token = jwt.sign({ 
                    username: results[0].StudentNumber,
                    userID: results[0].StudentID
                }, SECRET_KEY);
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
app.get('/api/getUser', (req, res) => {
    // token 받아와서 유저 테이블
    const user = authenticateRequest(req);
    console.log(user);

    db.query('SELECT * FROM Students WHERE StudentNumber = ?', user.username, async (error, results) => {
        if(results.length > 0){
            //유저 정보 전부 리턴
            console.log(results[0]);
            return res.status(200).json({ userId: results[0].StudentNumber, userName: results[0].StudentName });
        }
        if(error){
            
            return res.status(401).send({ message: "유저 정보 없음"})
        }
    });
});

// 시트정보 추출
app.post('/api/getSeats', (req, res) => {
    const {route, canReserve}  = req.body; // 루트 이름과 시간을 받아옴
    console.log(route, canReserve);
    // 루트 이름과 시간으로 시간표에서 버스 ID를 찾음
    db.query('SELECT * FROM Routes WHERE Name = ? AND timeTable >= CURTIME() ORDER BY ABS(TIMESTAMPDIFF(MINUTE, STR_TO_DATE(timeTable, "%H:%i:%s"), CURTIME())) LIMIT 1', [route], async (error, results) => {

        if (error) {
            console.error("Error: ", error);
            return res.status(500).send({ message: "서버 오류 발생" });
        }

        if (results.length > 0) {
            console.log(results[0]);
            db.query('SELECT * FROM Buses INNER JOIN Seats ON Buses.BusID = Seats.BusID INNER JOIN Routes ON Seats.BusID = Routes.BusID WHERE Buses.BusID = ? AND Routes.TimeTable = ? ORDER BY Num', [results[0].BusID, results[0].timeTable], async(err, seatsResults) => {
                if (error) {
                    console.error("Error: ", error);
                    return res.status(500).send({ message: "서버 오류 발생" });
                }

                if(seatsResults.length > 0){
                    console.log(seatsResults[0]);
                    return res.status(200).send({ seats: seatsResults });
                }else {
                    return res.status(404).send({ message: "정보 없음2"});
                }
                
            });
           //현재시간이 시간표보다 지나갔을 때
        } else if(route == "새절&DMC" && canReserve[0] > 0){
            //새절&DMC노선의 첫번째 시간표 출력
            db.query('SELECT * FROM Buses INNER JOIN Seats ON Buses.BusID = Seats.BusID INNER JOIN Routes ON Seats.BusID = Routes.BusID WHERE Buses.BusID = 1 AND Routes.timeTable = "08:05:00" ORDER BY Num', async(err, seatsResults) => {
                return res.status(200).send({ seats: seatsResults});
            });            
        } else if(route == "신촌&합정" && canReserve[1] > 0){
            //신촌&합정 노선의 첫번째 시간표 출력
            db.query('SELECT * FROM Buses INNER JOIN Seats ON Buses.BusID = Seats.BusID INNER JOIN Routes ON Seats.BusID = Routes.BusID WHERE Buses.BusID = 2 AND Routes.timeTable = "08:05:00" ORDER BY Num', async(err, seatsResults) => {
                return res.status(200).send({ seats: seatsResults});
            });
        }else {
            console.log(results);
            return res.status(404).send({ message: "정보 없음" });
        }
    });
});

app.post('/api/makeReservation', (req, res) =>{
    const reservationInfo = req.body;
    const token = authenticateRequest(req);
    console.log({reservationInfo: reservationInfo}, {token: token});
    if(reservationInfo.length !== null && token !== null){
        db.query("UPDATE Seats SET IsReserved = true WHERE SeatID = ?", [reservationInfo.SeatID], async(error, results) => {
            if(error){
                console.error(error);
            }
            console.log("Seat 테이블 정보변경 성공");
        });
        db.query("INSERT INTO Reservations (StudentID, RouteID, BusID, SeatID) VALUES (?, ?, ?, ?)", [token.userID, reservationInfo.RouteID, reservationInfo.BusID, reservationInfo.SeatID], async(err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: '예약 등록중 오류가 발생했습니다.', err });
            }
            console.log("Reservations 정보입력 성공");
            return res.status(201).send({ message: '예약이 성공적으로 완료되었습니다.' });
        });
    }else {
        return res.status(404).send({ message: "값이 없습니다."});
    }
});

app.get('/api/getReservation', (req, res) => {
    const token = authenticateRequest(req);
   
    db.query("SELECT * FROM Reservations INNER JOIN Students ON Students.StudentID = Reservations.StudentID INNER JOIN Routes ON Routes.RouteID = Reservations.RouteID INNER JOIN Buses ON Buses.BusID = Reservations.BusID INNER JOIN Seats ON Seats.SeatID = Reservations.SeatID WHERE Reservations.StudentID = ? ORDER BY ReservationID DESC LIMIT 1", [token.userID], async(err, results) => {
        if(err){
            console.error(err);
            return res.status(500).send({ message: "서버 에러"});
        }
        if(results.length > 0){
            console.log("정보 전송 선공");
            return res.status(201).send({ results: results[0] });
        }else{
            db.query("SELECT * FROM Students WHERE StudentID = ?", [token.userID], async(error ,subResults) => {
                if(subResults !== null){
                    console.log("예약안된 유저");
                    return res.status(201).send({ results: subResults[0], message:"NoReservation" });
                }else{
                    console.log("값 없음");
                    return res.status(404).send({ message: "정보를 찾지 못하였습니다."})
                }
            });
        }
    })
})

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




// 버스 시간표 시작 15분전에 Seats의 IsReserved 컬럼 초기화

// 데이터베이스 컬럼 초기화 함수
const resetIsReserved = () => {
    console.log("Job 실행");
    const query = "UPDATE Seats SET IsReserved = 0";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error resetting column:', err);
            return;
        }
        console.log('Column reset successfully at', new Date());
    });
};


const job = schedule.scheduleJob({hour: [7, 8, 12, 13, 15, 16, 17, 18], minute: 35, dayOfWeek: [0, 1, 2, 3, 4, 5]}, () => {
  resetIsReserved();
});

// schedule test함수
// const date = new Date();
// date.setMinutes(date.getMinutes() + 1);

// const job = schedule.scheduleJob(date, () => {
//     resetIsReserved(1);
// });

// // 스케줄러가 제대로 설정되었는지 확인
// console.log(`Job scheduled for: ${date}`);

app.listen(3001, () => {
  console.log("Server is running onn port 3001");
});


