import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// 로그인 안되있으면 진입불가 => 로그인 화면으로 이동
const QRCodeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>QR</Text>
      <View style={styles.qrContainer}>
        {/* QR 코드 이미지를 표시할 컴포넌트 */}
        <Image
          source={require('../images/QRcode.png')} // 실제 QR 이미지 경로로 변경
          style={styles.qrCode}
        />
      </View>
      {/* 회원정보 불러오기, DB에 QR,예약 여부확인 */}
      <View style={styles.infoCard}>
        <Text style={styles.userInfo}>김명준</Text>
        <Text style={styles.userInfo}>2022260000</Text>
        <Text style={styles.userInfo}>탑승 가능</Text>
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
    marginTop: 50,
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
