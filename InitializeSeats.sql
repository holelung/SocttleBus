DROP PROCEDURE IF EXISTS InitializeSeats;
DELIMITER //

CREATE PROCEDURE InitializeSeats()
BEGIN
    DECLARE seatCounter INT DEFAULT 1;
    DECLARE seatPrefix CHAR(1);

    -- BusID 1에 대한 좌석 초기화 (29인승, 좌석 번호: A1, A2, ...)
    SET seatPrefix = 'A';
    WHILE seatCounter <= 29 DO
        INSERT INTO Seats (BusID, SeatID) VALUES (1, CONCAT(seatPrefix, seatCounter));
        SET seatCounter = seatCounter + 1;
    END WHILE;

    -- BusID 2에 대한 좌석 초기화 (45인승, 좌석 번호: B1, B2, ...)
    SET seatCounter = 1;
    SET seatPrefix = 'B';
    WHILE seatCounter <= 45 DO
        INSERT INTO Seats (BusID, SeatID) VALUES (2, CONCAT(seatPrefix, seatCounter));
        SET seatCounter = seatCounter + 1;
    END WHILE;
END //

DELIMITER ;

-- 스토어드 프로시저 호출
CALL InitializeSeats();


select * from Seats;