import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {QRCode, Canvas} from 'easyqrcode-react-native';
import AppContext from './AppContext';


// 로그인 안되있으면 진입불가 => 로그인 화면으로 이동
const QRCodeScreen = ({ navigation }) => {
  const [reservationInfo, setReservationInfo] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const ip = useContext(AppContext);

  useFocusEffect(
    // 로그아웃 등 다시 Home화면을 불러올때 작동
    useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('user-token');
          if (token){
            // 로그인 확인
            setIsLoggedIn(true);
            const userInfo = await getUserInfo(token);
            setUserInfo(userInfo);

            try {
              const response = await axios.get(`${ip}getReservation`, {
                headers: {
                  Authorization: `Bearer ${token}` // 헤더에 토큰을 포함합니다.
                }
              });
              
              if(response.data.results !== "NoReservation"){
                setIsReserved(true);
                setReservationInfo(response.data.results);
              } else {
                setIsReserved(false);
              }
              
            }catch (error){
              console.log('Error fetching user data:', error);
            }      
          }else{
            setIsLoggedIn(false);
             Alert.alert(
              "로그인 필요",
              "QR 코드를 확인하려면 로그인해야합니다.",
              [
                { text: "뒤로가기", onPress: () => navigation.goBack() },
                { text: "로그인", onPress: () => navigation.navigate("LoginScreen") }
              ]
            );
          }
        };

      checkLoginStatus();
    }, [navigation])
  );

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo])


  const getUserInfo = async(token) => {
    try{
      const response = await axios.get(`${ip}getUser`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      return (response.data);
    }catch(error){
      console.log('Error fetching user data:', error);
    }
  };


  // qr생성
  generateQRCode = (canvas) => {
    if (canvas !== null){
      if(isReserved && reservationInfo){
        var qrData = JSON.stringify({
          'ID': reservationInfo.ReservationID,
          'Seat': reservationInfo.SeatID,
          'Student': reservationInfo.StudentID,
          'Route': reservationInfo.RouteID,
          'Bus': reservationInfo.BusID,
          'Time': reservationInfo.timeTable
        });
      }else {
        var qrData = JSON.stringify({
          'ID': userInfo.StudentID,
          'Name': userInfo.StudentName
        })
      }
     

      // QRCode options
      var options = {
        text: qrData
    	};
    	// Create QRCode Object
    	var qrCode = new QRCode(canvas, options);
    }
  }

  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>QR</Text>
      {/* QR 코드 이미지를 표시할 컴포넌트 */}
      <View style={styles.qrContainer}>
        <Canvas ref={this.generateQRCode}/>
      </View>
      {/* 회원정보 불러오기, DB에 QR,예약 여부확인 */}
      <View style={styles.infoCard}>
        <Text style={styles.userInfo}>{userInfo.StudentName}</Text>
        <Text style={styles.userInfo}>{userInfo.StudentNumber}</Text>
        <Text style={styles.userInfo}>예약 여부: {isReserved ? 'Yes' : 'No'}</Text>
        {isReserved && reservationInfo && (
          <>
            <Text style={styles.userInfo}>예약 시간: {reservationInfo.timeTable}</Text>
            <Text style={styles.userInfo}>예약 좌석: {reservationInfo.SeatID}</Text>
          </>
        )}
      </View>
      {/* 예약된 셔틀 시간대와 경로를 불러와야함. */}
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
    alignItems: 'center',
  },
  header: {
    marginTop: 100,
    fontSize: 24,
    fontWeight: 'bold',
  },
  qrContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: 200, // QR 코드 이미지의 크기에 맞게 조정
    height: 200,
  },
  infoCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5,
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
});

export default QRCodeScreen;
