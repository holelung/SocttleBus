const mysql = require('mysql');

// 데이터베이스 연결을 위한 설정
const dbConfig = {
    user: "root",
    host: "localhost",
    password: "335276",
    database: "shuttle_bus",
    connectionLimit: 10,
};

//데이터베이스 연결을 생성하는 함수
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

// pool 사용시 module.exports ={getConnection}; 으로 변경할것

// const pool = mysql.createPool(dbConfig);

// const getConnection = (callback) => {
//     pool.getConnection((err, connection) => {
//         if(err) {
//             return callback(err, null);
//         }
//         callback(null, connection);
//     });
// };
