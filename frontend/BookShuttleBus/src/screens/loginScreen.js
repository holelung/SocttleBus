import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import Axios from 'axios';


function LoginScreen({navigation}) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
        try {
            const response = await fetch('http://172.30.1.84:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    password,
                }),
            });
            const json = await response.json();
            if (response.status === 200) {
                Alert.alert('Success', json.message);
                // 로그인 성공 후의 로직 처리
                navigation.navigate("Home");
            } else {
                Alert.alert('Error', json.message);
            }
        } catch (error) {
            Alert.alert('Error', '네트워크 에러가 발생했습니다.');
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
      <Button title="로그인" onPress={handleLogin} />
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
