import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const ReservationScreen =  ({ navigation }) => {
    // 이 함수는 버튼 클릭 시 호출되어 예약 화면을 업데이트할 수 있습니다.
    const selectRoute = (routeName) => {
        // TODO: 선택된 노선에 대한 로직 구현
        console.log(routeName + ' route selected.');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>좌석현황 & 예약하기</Text>
            </View>
            <View style={styles.routeSelection}>
                <TouchableOpacity style={styles.routeButton} onPress={() => selectRoute('새절 & DMC')}>
                    <Text style={styles.routeButtonText}>새절 & DMC</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.routeButton} onPress={() => selectRoute('신촌 & 홍대')}>
                    <Text style={styles.routeButtonText}>신촌 & 홍대</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.info}>
                <Text style={styles.infoText}>출발 시간: 8:20</Text>
                <Text style={styles.infoText}>29인승</Text>
            </View>
            <ScrollView style={styles.seatsContainer}>
                {/* 좌석 번호는 데이터에 따라 동적으로 생성해야 합니다. */}
                <View style={styles.seatRow}>
                    <Text style={styles.seat}>A-1</Text>
                    <Text style={styles.seat}>A-2</Text>
                    {/* ... 모든 좌석에 대해 반복 */}
                </View>
                {/* ... 다른 좌석 행을 위한 추가 View 컴포넌트 */}
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
    seatsContainer: {
        flex: 1,
        margin: 10,
    },
    seatRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    seat: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        textAlign: 'center',
        padding: 10,
        margin: 2,
    },
    bottomNav: {
        position: 'absolute',
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
