const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');
const seatRoutes = require('./src/routes/seatRoutes');




const cors = require('cors');



const app = express();
app.use(express.json());

// 미들웨어 설정...

// 라우트 설정
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', reservationRoutes);
app.use('/api', seatRoutes);

// 테스트 출력
app.get("/", function(req, res){
    res.send("Hello world!");
});



// 서버 시작
app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
