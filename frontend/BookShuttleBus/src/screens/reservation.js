import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AppContext from './AppContext';
import moment from 'moment';

  // 배열을 청크로 나누는 함수
    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };


const ReservationScreen =  ({ navigation }) => {
    const ip = useContext(AppContext);

    // seats는 Buses, Routes, Seats 테이블의 정보를 모두 포함한다.
    const [seats, setSeats] = useState([]);
    const [route, setRoute] = useState();
    const [routeTime, setRouteTime] = useState("00:00:00");
    const [type, setType] = useState();
    var canReserve = [];
    //현재시간
    var date = moment().utcOffset('+09:00');
    //시간표 마지막시간 dmc 18:00, 신촌 17:50
    //dmc 예약 마감시간
    const timeDMC = moment('17:50:00', 'HH:mm:ss');
    //신촌 예약 마감시간
    const timeSC = moment('17:40:00', 'HH:mm:ss');
    // 마감시간 - 현재시간 저장
    canReserve[0] = moment.duration(date.diff(timeDMC)).asHours();
    canReserve[1] = moment.duration(date.diff(timeSC)).asHours();

    
     // 이 함수는 버튼 클릭 시 호출되어 예약 화면을 업데이트할 수 있습니다.
    const selectRoute = (routeName) => {
        console.log(canReserve);
        // TODO: 선택된 노선에 대한 로직 구현
        setRoute(routeName);
        console.log(routeName + ' route selected.');
        getSeats(routeName, canReserve);
    };

    const getSeats = async(route, canReserve) => {
        try{
            //route = 새절&DMC || 신촌&합정
            const response = await axios.post(`${ip}getSeats`, {route, canReserve});
            // seats = Buses, Seats, Routes 테이블 전체 
            setSeats(response.data.seats);
            setRouteTime(response.data.seats[0].timeTable);
            setType(response.data.seats[0].Type);
            console.log(response.data.seats[0]);

            console.log("시트 불러오기 성공");
        }catch (error) {
             console.error('시트정보 불러오기 실패:', error);
        }
    };
    //예약 버튼 클릭
    const reserveBtn = (seatId) => {
        
         Alert.alert(
            seats.SeatID,
            "예약하시겠습니까?", [
                {text: "아니오", style: "cancel"},
                {
                    text: "예" ,
                    style: "destructive",
                    onPress: async() => reserve(seatId),
                }
            ]
        )
    };


    //예약
    const reserve = async(seatId) => {
        const token = await AsyncStorage.getItem('user-token');
        var reservationInfo = [];
        var len = seats.length;

        // SeatID에 해당하는 seats 데이터 저장
        for(var i = 0; i< len; i++){
            if (seats[i].SeatID === seatId) {
                reservationInfo = seats[i];
                console.log(reservationInfo);
                break;
            }
        }

        try{
            const response = await axios.post(`${ip}makeReservation`, reservationInfo, {
                headers: {
                  Authorization: `Bearer ${token}` // 헤더에 토큰을 포함합니다.
                },
            });
            console.log('예약 완료:', response.data.message);
            // 에약 등록후 예약좌석변경 
            const IsReserveChange = await axios.post(`${ip}changeIsReserved`, reservationInfo);
            console.log("좌석 정보변경 완료:", IsReserveChange.data.message);

            Alert.alert('예약 완료 되었습니다.');
            getSeats(reservationInfo.Name, canReserve);
        }catch (error) {
             if (error.response && error.response.status === 409) {
                // 서버에서 전달한 메시지를 활용
                const errorMessage = error.response.data.message;
                console.error('실패:', errorMessage);
                Alert.alert(errorMessage);
            } else {
                // 그 외의 에러 처리
                console.error('예약 실패:', error);
                Alert.alert('예약 과정에서 오류가 발생했습니다.');
            }
        }
    };


     // 좌석을 렌더링하는 함수 (좌석 데이터를 파라미터로 받습니다)
    const renderSeat = (seats, index, isLast) => {
        // seats.IsReserved 가 1일때 값 입력
        const isReserved = seats.IsReserved === 1;
        const seatStyle = isReserved ? styles.reservedSeat : styles.availableSeat;
         // 4n - 2번째 좌석이면서 마지막 좌석이 아닌 경우에만 공간을 추가
        const isSpaceAfter = (index + 1) % 4 === 2 && !isLast;

        return (
           <View key={seats.SeatID} style={styles.seatWrapper}>
                <TouchableOpacity style={seatStyle} disabled={isReserved} onPress={() => reserveBtn(seats.SeatID)}>
                    <Text>{seats.SeatID}</Text>
                </TouchableOpacity>
                {/* 4n - 2번째 좌석 뒤에 공간 추가 */}
                {isSpaceAfter && <View style={styles.space} />}
            </View>
        );
    };
    // View에서 호출
    const renderRows = (seats) => {
        const seatRows = chunkArray(seats, 4); // 4개씩 나누어 줄 단위로 배열 생성
        return seatRows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
                {row.map((seat, index) => renderSeat(seat, index, index === row.length - 1))}
            </View>
        ));
    };

   

    
    useEffect(() => {


    }, [route]);
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>좌석현황 & 예약하기</Text>
            </View>
            <View style={styles.routeSelection}>
                <TouchableOpacity style={styles.routeButton} onPress={() => selectRoute('새절&DMC')}>
                    <Text style={styles.routeButtonText}>새절 & DMC</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.routeButton} onPress={() => selectRoute('신촌&합정')}>
                    <Text style={styles.routeButtonText}>신촌 & 합정</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.info}>
                <Text style={styles.infoText}>출발 시간: {routeTime.slice(0,5)}</Text>
                <Text style={styles.infoText}>{type}인승</Text>
            </View>
            <ScrollView style={styles.seatsContainer}>
                {renderRows(seats)}
            </ScrollView>

            <View style={styles.bottomNav}>
                {/* QR코드 버튼 */}
                <TouchableOpacity onPress={() => navigation.navigate("QRCodeScreen")}>
                <Ionicons name="qr-code" size={24} color="white" />
                </TouchableOpacity>
                {/** 홈 버튼 */}
                <TouchableOpacity  onPress={() => navigation.navigate("Home")}>
                <Ionicons name="home-outline" size={24} color="white" />
                </TouchableOpacity>
                {/** 마이페이지 버튼 */}
                <TouchableOpacity onPress={() => navigation.navigate("MyPage")}>
                <Ionicons name="person-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    header: {
        marginTop: 50,
        padding: 20,
        backgroundColor: '#007bff',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
    },
    routeSelection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#e6e6e6',
        paddingVertical: 10,
    },
    routeButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    routeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#e6e6e6',
    },
    infoText: {
        fontSize: 16,
    },

    // 시트 관련 스타일
    seatsContainer: {
        flex: 1,
        margin: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        
    },
    row: {
        // 각 줄에 대한 스타일
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: 'center',
    },
    availableSeat: {
        // 예약 가능한 좌석 스타일
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        margin: 5,
        padding: 10,
        backgroundColor: '#AEEEEE',
    },
     reservedSeat: {
        // 예약된 좌석 스타일
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        margin: 5,
        padding: 10,
        backgroundColor: '#FF6347',
    },
    seatRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    seatStyle: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        textAlign: 'center',
        padding: 10,
        margin: 2,
    },
    space: {
        width: 90, // 공간의 너비를 조절하여 원하는 크기의 공백을 생성
    },
    seatWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        // ... 기존 스타일
    },


    bottomNav: {
        
        bottom: 0,
        width: '100%',
        height: '10%',
        backgroundColor: '#0000ff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    // 스타일링을 더 추가할 수 있습니다...
});

export default ReservationScreen;
