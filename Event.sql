-- 이벤트 스케줄러 켜져있는지 확인 
SHOW VARIABLES LIKE 'event%';

-- 이벤트 스케줄러 켜기
SET GLOBAL event_scheduler = ON;

-- 이미 있는 이벤트가 있는지 확인
SELECT * FROM information_schema.events;


CREATE EVENT reset_Seats
ON SCHEDULE EVERY 1 DAY
STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 1 DAY)
DO
  UPDATE your_table SET your_column = 0;
