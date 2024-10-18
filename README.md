# Capston 셔틀버스 예약앱
## 앱 다운로드 링크(안드로이드)

https://drive.google.com/file/d/16gh_XbxFQDuseEF1jmacDeezj41oBCKf/view?usp=sharing

![%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-02-13_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_6 35 26](https://github.com/user-attachments/assets/197b45cb-43a1-461e-b1fc-858a9a11bd17)

---

## 프로젝트 소개
이 프로젝트는 **셔틀버스 예약 시스템**으로, 사용자가 앱을 통해 셔틀버스를 예약할 수 있도록 도와줍니다.

## 설치 및 실행 방법

### Backend 설치
1. Python과 Flask를 설치합니다.
2. `requirements.txt` 파일에 있는 종속성 패키지를 설치합니다:
   ```bash
   pip install -r requirements.txt
   ```
3. 백엔드 서버를 실행합니다:
   ```bash
   python app.py
   ```

### Frontend 설치
1. Node.js와 npm을 설치합니다.
2. 프론트엔드 폴더에서 필요한 종속성을 설치합니다:
   ```bash
   npm install
   ```
3. 프론트엔드 개발 서버를 실행합니다:
   ```bash
   npm start
   ```

### Database 설정
1. 제공된 SQL 파일을 사용해 MySQL 데이터베이스를 설정합니다.
2. `DB.sql`, `Event.sql`, `InitializeSeats.sql`, `Reservation.sql` 파일을 실행하여 필요한 테이블과 데이터를 설정합니다.

## 기술 스택
- **Backend**: Flask, SQLAlchemy, Python
- **Frontend**: React
- **Database**: MySQL

## 주요 기능 설명
- 사용자 로그인 및 회원가입
- 셔틀버스 예약
- 예약 조회 및 취소 기능


