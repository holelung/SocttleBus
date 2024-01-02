
const getConnection = require('../config/dbConfig');
const authReq = require('../utils/authReq');
const schedule = require('node-schedule');


// 예약 생성
exports.makeReservation = async(req, res, next) => {
    const reservationInfo = req.body;
    const token = authReq.authenticateRequest(req);
    
    if (!reservationInfo || !token) {
        return res.status(400).send({ message: '예약 정보 또는 사용자 토큰이 누락되었습니다.' });
    }

    const connection = getConnection();

    connection.query("INSERT INTO Reservations (StudentID, RouteID, BusID, SeatID) VALUES (?, ?, ?, ?)", [token.userID, reservationInfo.RouteID, reservationInfo.BusID, reservationInfo.SeatID], (error, results) => {
        if(error) {
            console.error(error);
            connection.end();
            return res.status(500).send({ message: '예약 중 오류가 발생했습니다.' });
        }

        connection.query("UPDATE Seats SET IsReserved = true WHERE SeatID = ?", [reservationInfo.SeatID], (err, updateResults) => {
            connection.end();
            if(err) {
                console.error(err);
                return res.status(500).send({ message: '좌석 상태 업데이트 중 오류가 발생했습니다.' });
            }
            console.log("시트 정보 변경 완료");
            return res.status(201).send({message: '예약이 완료되었습니다.'});
        });
    });
};


// 예약 정보 불러오기
exports.getReservation = (req, res, next) => {
    const token = authReq.authenticateRequest(req);

    if (!token) {
        return res.status(401).send({ message: "인증 실패 또는 유효하지 않은 토큰" });
    }

    try {
        const connection = getConnection();

        connection.query("SELECT * FROM Reservations INNER JOIN Students ON Students.StudentID = Reservations.StudentID INNER JOIN Routes ON Routes.RouteID = Reservations.RouteID INNER JOIN Buses ON Buses.BusID = Reservations.BusID INNER JOIN Seats ON Seats.SeatID = Reservations.SeatID WHERE Reservations.StudentID = ? ORDER BY ReservationID DESC LIMIT 1", [token.userID], (err, results) => {
            if (err) {
                throw err;
            }

            if (results.length > 0) {
                console.log("정보 전송 성공");
                connection.end();
                return res.status(200).send({ results: results[0] });
            } else {
                connection.query("SELECT * FROM Students WHERE StudentID = ?", [token.userID], (error, subResults) => {
                    if (error) {
                        throw error;
                    }

                    if (subResults.length > 0) {
                        console.log("예약안된 유저");
                        connection.end();
                        return res.status(200).send({ results: subResults[0], message: "NoReservation" });
                    } else {
                        console.log("값 없음");
                        connection.end();
                        return res.status(404).send({ message: "정보를 찾지 못하였습니다." });
                    }
                });
            }
        });
    } catch (error) {
        console.error("서버 오류:", error);
        return res.status(500).send({ message: "서버 오류 발생" });
    }
};

// 데이터베이스 컬럼 초기화 함수
const resetIsReserved = () => {
    console.log("Job 실행");

    const connection = getConnection();
    const query = "UPDATE Seats SET IsReserved = 0";

    connection.query(query, (err, results) => {
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