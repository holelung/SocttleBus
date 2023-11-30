CREATE TABLE Buses (
    BusID INT AUTO_INCREMENT PRIMARY KEY,
    Type VARCHAR(50),
    VehicleNumber VARCHAR(50)
);
CREATE TABLE Seats (
    SeatID varchar(20) PRIMARY KEY,
    BusID INT,
	IsReserved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (BusID) REFERENCES Buses(BusID)
);

CREATE TABLE Routes (
    RouteID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Description TEXT
);
CREATE TABLE Students (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    Password VARCHAR(255),
    Name VARCHAR(100),
    StudentNumber VARCHAR(50)
);
CREATE TABLE Reservations (
    ReservationID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    RouteID INT,
    BusID INT,
    SeatID varchar(20),
    DateTime DATETIME,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (RouteID) REFERENCES Routes(RouteID),
    FOREIGN KEY (BusID) REFERENCES Buses(BusID),
    FOREIGN KEY (SeatID) REFERENCES Seats(SeatID)
);
