const jwt = require('jsonwebtoken');

const SECRET_KEY = 'I_AM_GOD'; // JWT 시크릿 키

// 인증 함수(JWT 사용)
exports.authenticateRequest = (req) => {
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
