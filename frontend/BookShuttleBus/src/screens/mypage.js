import React, { useEffect, useState, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AppContext from './AppContext';


const MyPage = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const ip = useContext(AppContext);
    const [undergrad, setUndergrad] = useState(null);

    useFocusEffect(
    // 로그아웃 등 다시 Home화면을 불러올때 작동
     useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('user-token');
          if (token){
            setIsLoggedIn(true);
            // 유저 정보 전체 불러오기
            try {
              const response = await axios.get(`${ip}getuser`, {
                headers: {
                  Authorization: `Bearer ${token}` // 헤더에 토큰을 포함합니다.
                }
              });
              console.log(response.data);
              setUserInfo(response.data);
              
            }catch (error){
              console.log('Error fetching user data:', error);
            }      
          }else{
            setIsLoggedIn(false);
             Alert.alert(
              "로그인 필요",
              "마이페이지를 이용하려면 로그인해야합니다.",
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
      if (userInfo && userInfo.userId) {
        const undergradYear = userInfo.userId.slice(0, 2);
        setUndergrad(undergradYear);
      }
    }, [userInfo]); // userInfo가 변경될 때마다 실행됩니다.

    const logoutUser = async () => {
        try {
            
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
          source={require('../images/logoCollege.jpeg')} // 아바타 이미지 경로로 변경하세요.
        />
        {/* isLoggedIn이 true면 View띄우고 아니면 로그인 탭  */}
        <Text style={styles.nameText}>{userInfo.userName} ({undergrad}학번)</Text>
        <Text style={styles.idText}>{userInfo.userId}</Text>
      </View>
      <View style={styles.menuContainer}>
        {/* 로그아웃 되어있을 경우 없음 */}
        <TouchableOpacity>
            <Text style={styles.menuItem}>비밀번호 변경</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text style={styles.menuItem}>알림 설정</Text>
        </TouchableOpacity>
        {/* 로그인이 안되있을 경우 로그인으로 변경 */}
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
