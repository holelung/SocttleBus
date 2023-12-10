SELECT * FROM Reservations;

SELECT * FROM Reservations
INNER JOIN Students ON Students.StudentID = Reservations.StudentID
INNER JOIN Routes ON Routes.RouteID = Reservations.RouteID
INNER JOIN Buses ON Buses.BusID = Reservations.BusID
INNER JOIN Seats ON Seats.SeatID = Reservations.SeatID;

INSERT INTO Reservations (StudentID, RouteID, BusID, SeatID) VALUES (2, 2, 1, "A3");



SELECT * FROM Seats;
SELECT * FROM Routes WHERE BusID = 1;

SELECT * FROM Routes;