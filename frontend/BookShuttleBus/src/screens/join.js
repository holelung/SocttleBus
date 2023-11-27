import React, { useState } from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet } from 'react-native';

const Join = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleRegister = async () => {
        if (userId === '' || password === '' || name === '') {
            Alert.alert('Validation Error', '사용자 이름과 비밀번호를 모두 입력해야 합니다.');
            return;
        }
        
        try {
            const response = await fetch('http://172.30.1.84:3001/api/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    password,
                    name,
                }),
            });
            const json = await response.json();
            if (response.status === 201) {
                Alert.alert('Success', json.message);
                // 회원가입 성공 후 로직
            } else {
                Alert.alert('Registration Failed', json.message);
            }
        } catch (error) {
            Alert.alert('Error', '네트워크 에러가 발생했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원가입</Text>
            <TextInput
                style={styles.input}
                placeholder="아이디"
                value={userId}
                onChangeText={setUserId}
            />
            <TextInput
                style={styles.input}    
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder='이름'
                value={name}
                onChangeText={setName}
            />
            <Button title="회원가입" onPress={handleRegister} />
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
export default Join;
