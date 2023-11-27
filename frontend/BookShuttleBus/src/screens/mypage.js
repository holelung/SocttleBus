import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AntDesign, Ionicons } from '@expo/vector-icons';


const API_URL = 'http://172.30.1.84:3001/api/';

axios.defaults.withCredentials = true; //쿠키사용

function MyPage({navigation}) {
    return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerText}>마이페이지</Text>
        </View>
        <View style={styles.profileContainer}>
            <View style={styles.profileIcon}>
            <AntDesign name="user" size={24} color="black" />
            <Text style={styles.profileText}>김명준 (22학번)</Text>
            <Text style={styles.profileId}>2022260000</Text>
            </View>
        </View>
        <View style={styles.menuContainer}>
            <Text style={styles.menuItem}>회원가입</Text>
            <Text style={styles.menuItem}>비밀번호 변경</Text>
            <Text style={styles.menuItem}>알림 설정</Text>
            <Text style={styles.menuItem}>로그아웃</Text>
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
    backgroundColor: '#F5FCFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  profileText: {
    fontSize: 18,
    marginTop: 10,
  },
  profileId: {
    fontSize: 16,
    color: 'grey',
  },
  menuContainer: {
    // Add styling for the menu container
  },
  menuItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0000ff',
    padding: 10,
  },
});

export default MyPage;