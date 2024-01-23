const getConnection = require('../config/dbConfig');
const authReq = require('../utils/authReq');
const timeCtr = require('../utils/koreanTime');

// 예약 생성
exports.makeReservation = async(req, res, next) => {
    const reservationInfo = req.body;
    const token = authReq.authenticateRequest(req);
    
    if (!reservationInfo || !token) {
        return res.status(400).send({ message: '예약 정보 또는 사용자 토큰이 누락되었습니다.' });
    }
    var day = selectDay();
    day = day + " " + reservationInfo.timeTable; 
    console.log(day);
    const connection = getConnection();

    connection.query("INSERT INTO Reservations (StudentID, RouteID, BusID, SeatID, Day) VALUES (?, ?, ?, ?, ?)", [token.userID, reservationInfo.RouteID, reservationInfo.BusID, reservationInfo.SeatID, day], (error, results) => {
        if(error) {
            console.error(error);
            connection.end();
            return res.status(500).send({ message: '예약 중 오류가 발생했습니다.' });
        }
        console.log("예약 정보 생성 완료");
        return res.status(201).send({message: '예약이 완료되었습니다.'});
    });
};


// 예약 정보 불러오기
exports.getReservation = async(req, res, next) => {
    const token = authReq.authenticateRequest(req);
    
    const connection = getConnection();
    if (!token) {
        return res.status(401).send({ message: "인증 실패 또는 유효하지 않은 토큰" });
    }

    try {
        const currentDate = timeCtr.getKorTime();  // 현재 시간(yyyy-mm-dd hh:mm:tt)
        const currentTime = currentDate.slice(11,19); // 현재 시간(hh:mm:tt)
        const nextDate = timeCtr.AddDay();  // 내일 날짜(yyyy-mm-dd)
        const lastTime = "18:40:00"; // 배차 종료시간
        var day;

        // 현재시간 > 마지막 배차시간 => 다음날 Reservation.Day로 확인
        if(currentTime > lastTime) {
            day = nextDate;
        }
        // 현재시간 < 마지막 배차시간 => 오늘 Reservation.Day로 확인
        if(currentTime <= lastTime) {
            day = currentDate.slice(0, 10);
        }
        connection.query("SELECT * FROM Reservations WHERE StudentID = ? AND INSTR(Day, ?) ORDER BY Day ASC LIMIT 1", [token.userID, day], async(err, results) => {
            if (err){
                console.error(err);
                throw err;
            }

            if (!results.length) {
                console.log("예약 정보 없음");
                return res.status(200).send({ results: "NoReservation"});
            }
            console.log("정보 전송 성공");    
            return res.status(200).send({ results: results[0] }); 
        });

    } catch (error) {
        console.error("서버 오류:", error);
        connection.end();
        return res.status(500).send({ message: "서버 오류 발생" });
    }finally {
        // 모든 경우에 대해 connection.end() 호출
        if (connection && connection.end) connection.end();
    }
};


const selectDay = () => {
    const currentDate = timeCtr.getKorTime();  // 현재 시간(yyyy-mm-dd hh:mm:tt)
    const currentTime = currentDate.slice(11,19); // 현재 시간(hh:mm:tt)
    const nextDate = timeCtr.AddDay();  // 내일 날짜(yyyy-mm-dd)
    const lastTime = "18:40:00"; // 배차 종료시간
    var day;

    // 현재시간 > 마지막 배차시간 => 다음날 Reservation.Day로 확인
    if(currentTime > lastTime) {
        day = nextDate;
    } else if(currentTime <= lastTime) { // 현재시간 < 마지막 배차시간 => 오늘 Reservation.Day로 확인
        day = currentDate.slice(0, 10);
    }
    return day;
}

