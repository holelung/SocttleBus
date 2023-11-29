import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://172.30.1.84:3001/api/';

const MyPage = ({ navigation }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('user-token');
            if (token) {
                setIsLoggedIn(true);
            }
        };
        checkLoginStatus();    
    }, []);

    const logoutUser = async () => {
        try {
            await axios.post(`${API_URL}logout`);
            await AsyncStorage.removeItem('user-token'); // 인증 토큰을 삭제합니다.
            // 로그아웃 처리 후의 로직을 실행합니다. 예를 들면 홈 화면으로 이동 등
            Alert.alert('로그아웃 되었습니다.');
            navigation.navigate("Home");
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>마이페이지</Text>
      </View>
      <View style={styles.profileContainer}>
        <Image
          style={styles.avatar}
          source={require('../images/profile.png')} // 아바타 이미지 경로로 변경하세요.
        />
        <Text style={styles.nameText}>김명준 (22학번)</Text>
        <Text style={styles.idText}>2022260000</Text>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity>
            <Text style={styles.menuItem}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text style={styles.menuItem}>비밀번호 변경</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text style={styles.menuItem}>알림 설정</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => logoutUser()}>
            <Text style={styles.menuItem}>로그아웃</Text>
        </TouchableOpacity>
      </View>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5FCFF',
  },
  header: {
    height: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    marginTop: 50,
    
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  idText: {
    fontSize: 16,
    color: 'gray',
  },
  menuContainer: {
    flex: 1,
    width: '100%',
  },
  menuItem: {
    padding: 20,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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

export default MyPage;
