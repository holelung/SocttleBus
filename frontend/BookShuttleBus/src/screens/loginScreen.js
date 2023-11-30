import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppContext from './AppContext';


axios.defaults.withCredentials = true; //쿠키사용

function LoginScreen({navigation}) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const ip = useContext(AppContext);

  const loginUser = async (userId, password) => {
    try {
      const response = await axios.post(`${ip}login`, { userId, password });
      // 로그인 성공 후, 서버로부터 받은 쿠키를 저장합니다.
      const token = response.data.token; // 서버로부터 받은 인증 토큰

      // AsyncStorage에 토큰 저장
      await AsyncStorage.setItem('user-token', token);
      
      console.log('로그인 성공:', response.data.message);
      Alert.alert('로그인 성공');
      navigation.navigate("Home");
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <TextInput
        style={styles.input}
        placeholder="사용자 이름"
        value={userId}
        onChangeText={setUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // 비밀번호 숨김 처리
      />
      <Button title="로그인" onPress={() => loginUser(userId, password)} />
      {/* 추가 링크나 기능이 필요하면 여기에 구현 */}
      <Button title="회원가입" onPress={() => navigation.navigate("Join")} />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
