const mysql = require('mysql');

// 데이터베이스 연결을 위한 설정
const dbConfig = {
    user: "root",
    host: "localhost",
    password: "335276",
    database: "shuttle_bus",
};

// 데이터베이스 연결을 생성하는 함수
const getConnection = () => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect(error => {
        if (error) {
            console.error('Error connecting to the database: ', error);
            return;
        }
        console.log('Connected to MySQL database');
    });
    return connection;
};

module.exports = getConnection;
