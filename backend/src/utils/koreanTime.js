exports.getKorTime = () => {
    // 현재 UTC 시간
    const now = new Date();

    // 한국은 UTC+9임
    const koreaTimeOffset = 9 * 60; // 9시간을 분으로 변환

    // 현재 UTC 시간에 한국 시간대 오프셋을 더함
    const koreanTime = new Date(now.getTime() + koreaTimeOffset * 60000); // 밀리초로 변환

    // ISO 문자열로 변환 및 형식 조정
    return koreanTime.toISOString().slice(0, 19).replace('T', ' ');
};

exports.AddDay = () => {
    // 현재 UTC 시간
    const now = new Date();

    // 한국은 UTC+9임
    const koreaTimeOffset = 9 * 60; // 9시간을 분으로 변환

    // 현재 UTC 시간에 한국 시간대 오프셋을 더함
    const koreanTime = new Date(now.getTime() + koreaTimeOffset * 60000);

    // 현재 날짜에 하루 더함
    koreanTime.setDate(koreanTime.getDate() + 1);

    return koreanTime.toISOString().slice(0, 10).replace('T', ' ');
}

