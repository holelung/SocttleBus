import React, { useState, useContext } from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AppContext from './AppContext';


const Join = ({navigation}) => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const ip = useContext(AppContext);

    const joinUser = async (userId, password, name) => {
        try {
            const response = await axios.post(`${ip}join`, {
                userId,
                password,
                name
            });
            console.log('회원가입 성공:', response.data.message);
            // 회원가입 성공 후 처리 로직
            Alert.alert('Success');
            navigation.navigate("LoginScreen");
        } catch (error) {
            console.error('회원가입 실패:', error.response ? error.response.data : error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원가입</Text>
            <TextInput
                style={styles.input}
                placeholder="힉번"
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
            <Button title="회원가입" onPress={() => joinUser(userId, password, name)} />
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
