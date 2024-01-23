const getConnection = require('../config/dbConfig');
const schedule = require('node-schedule');

// 시트 정보 불러오기 함수
exports.getSeats = (req, res, next) => {
    const { route, canReserve } = req.body;

    try {
        const connection = getConnection();

        connection.query('SELECT * FROM Routes WHERE Name = ? AND timeTable >= CURTIME() ORDER BY ABS(TIMESTAMPDIFF(MINUTE, STR_TO_DATE(timeTable, "%H:%i:%s"), CURTIME())) LIMIT 1', [route], (error, results) => {
            if (error) {
                throw error;
            }

            if (results.length > 0) {
                connection.query('SELECT * FROM Buses INNER JOIN Seats ON Buses.BusID = Seats.BusID INNER JOIN Routes ON Seats.BusID = Routes.BusID WHERE Buses.BusID = ? AND Routes.TimeTable = ? ORDER BY Num', [results[0].BusID, results[0].timeTable], (err, seatsResults) => {
                    if (err) {
                        throw err;
                    }

                    if (seatsResults.length > 0) {
                        connection.end();
                        return res.status(200).send({ seats: seatsResults });
                    } else {
                        connection.end();
                        return res.status(404).send({ message: "정보 없음2" });
                    }
                });
            } else if (route === "새절&DMC" && canReserve[0] > 0) {
                // 새절&DMC노선의 첫번째 시간표 출력
                connection.query('SELECT * FROM Buses INNER JOIN Seats ON Buses.BusID = Seats.BusID INNER JOIN Routes ON Seats.BusID = Routes.BusID WHERE Buses.BusID = 1 AND Routes.timeTable = "08:05:00" ORDER BY Num', (err, seatsResults) => {
                    if (err) {
                        throw err;
                    }

                    connection.end();
                    return res.status(200).send({ seats: seatsResults });
                });
            } else if (route === "신촌&합정" && canReserve[1] > 0) {
                // 신촌&합정 노선의 첫번째 시간표 출력
                connection.query('SELECT * FROM Buses INNER JOIN Seats ON Buses.BusID = Seats.BusID INNER JOIN Routes ON Seats.BusID = Routes.BusID WHERE Buses.BusID = 2 AND Routes.timeTable = "08:05:00" ORDER BY Num', (err, seatsResults) => {
                    if (err) {
                        throw err;
                    }

                    connection.end();
                    return res.status(200).send({ seats: seatsResults });
                });
            } else {
                connection.end();
                return res.status(404).send({ message: "정보 없음" });
            }
        });
    } catch (err) {
        console.error("서버 오류:", err);
        return res.status(500).send({ message: "서버 오류 발생" });
    }
};


// isReserved 삭제 예정 
// isReserved 변환 함수
exports.changeIsReserved = (req, res, next) => {
    const seat = req.body;

    if (!seat) {
        return res.status(400).send({ message: '정보가 누락되었습니다.'});
    }

    try{
        const connection = getConnection();

        connection.query("UPDATE Seats SET IsReserved = true WHERE SeatID = ?", [seat.SeatID], (error, results) => {
            
            connection.end();

            if(error) {
                console.error(error);
                
                return res.status(500).send({ message: '시트정보 변경 중 오류발생'});
            }
            console.log("시트정보 변경 완료");
            return res.status(201).send({message : '시트 정보 변경완료'});
            
        });
    }catch(error){
        console.error(error);
    }
    
};


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

