import React,{ useState, useEffect, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AppContext from './AppContext';
import axios from 'axios';

const API_URL = 'http://172.30.1.13:3001/api/';


function Home({navigation}) {
  const [route, setRoute] = useState(true);
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const ip = useContext(AppContext);

  useFocusEffect(
    // 로그아웃 등 다시 Home화면을 불러올때 작동
    useCallback(() => {
      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('user-token');
        if (token){
          setIsLoggedIn(true);
        }else{
          setIsLoggedIn(false);
        }
      };

      checkLoginStatus();
    }, [])
  );

  useEffect(() => {
  

  const loadHead = async () => {
    try {
      const head = await AsyncStorage.getItem("head-key");
      if (head !== null) {
        setTableHead(JSON.parse(head));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("data-key");
      if (data !== null) {
        setTableData(JSON.parse(data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 로그인 체킹(첫 화면 오픈)
  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('user-token');
      if (token) {
        setIsLoggedIn(true);
      }
    };
  
  // useEffect 내에서 함수들을 호출
  checkLoginStatus(); 
  loadHead();
  loadData();
}, []);
  // DMC 노선
  const dmcTableHead = ['운행순서', '학교', 'DMC역', '새절역', '학교'];
  const dmcTableData = [
    ['1', '8:05', '8:35', '8:40', '8:50'],
    ['2', '9:05', '9:35', '9:40', '9:50'],
    ['3', '16:10', '16:35', '16:40', '16:50'],
    ['4', '17:10', '17:30', '17:35', '17:50'],
    ['5', '18:00', '18:20', '18:25', '18:40'],
  ];
  //신촌 노선
  const sinchonTableHead = ['운행순서', '학교', '신촌역', '홍대역', '학교'];
  const sinchonTableData = [
    ['1', '8:05', '8:35', '8:40', '8:50'],
    ['2', '9:05', '9:35', '9:40', '9:50'],
    ['3', '13:30', '13:50', '13:55', '14:15'],
    ['4', '14:30', '14:50', '14:55', '15:15'],
    ['5', '16:10', '16:30', '16:35', '16:50'],
    ['6', '17:10', '17:30', '17:35', '17:50'],
    ['7', '17:50', '18:10', '18:15', '18:35'],
  ];

  const saveHead = async(key) =>{
    try {
      const headValue = JSON.stringify(key);
      await AsyncStorage.setItem('head-key', headValue.toString());
    } catch(error){
      console.log(error);
    }
  };
  const saveData = async(key) =>{
    try {
      const dataValue = JSON.stringify(key);
      await AsyncStorage.setItem('data-key', dataValue.toString());
    } catch(error){
      console.log(error);
    }
  };
  const loadHead = async() =>{
    try{
      const head = await AsyncStorage.getItem("head-key")
      if (head !== null){
        setTableHead(JSON.parse(head));
      }else {
        setTableHead(dmcTableHead);
      }
    }catch(error){
      console.log(error);
    }
  };
  const loadData = async() =>{
    try{
      const data = await AsyncStorage.getItem("data-key")
      if (head !== null){
        setTableData(JSON.parse(data));
      }else {
        setTableData(dmcTableData);
      }
    }catch(error){
      console.log(error);
    }
  };
  //DMC경로
  const first = () => {
    setRoute(true);
    setTableHead(dmcTableHead);
    setTableData(dmcTableData);
    saveHead(dmcTableHead);
    saveData(dmcTableData);
  };

  //신촌 경로
  const second = () => {
    setRoute(false);
    setTableHead(sinchonTableHead);
    setTableData(sinchonTableData);
    saveHead(sinchonTableHead);
    saveData(sinchonTableData);
  };

  //로그아웃
  const logoutUser = async () => {
  await AsyncStorage.removeItem('user-token');
  setIsLoggedIn(false);
  // 로그인 화면으로 이동하거나 다른 처리를 수행합니다.
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Image 
          style={styles.logo}
          source={require('../images/logoCollege.jpeg')}
          resizeMode='contain'
        />
      </View>

      <TouchableOpacity 
        onPress={() => isLoggedIn ? navigation.navigate("ReservationScreen") : navigation.navigate("LoginScreen")} 
        style={styles.loginMenu}>
        <Text style={styles.loginMenuText}>{isLoggedIn ? '예약하기' : '로그인'}</Text>
      </TouchableOpacity>

      <View style={styles.menuBox}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("LocationScreen")}
          style={styles.box}>
          <AntDesign name="enviroment" size={24} color="black" />
          <Text style={styles.boxText}>셔틀 위치</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeTable}>
        <Text style={styles.timeTableText}>셔틀 시간표</Text>
        <View style={styles.route}>
          <TouchableOpacity onPress={first}>
              <Text style={{...styles.routeText, backgroundColor: route ? "#96BBE8" : "#eee"}}>새절 & DMC</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={second}>
            <Text style={{...styles.routeText, backgroundColor: !route ? "#96BBE8" : "#eee"}}>신촌 & 합정</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.tableContainer}>
          <View style={styles.table}>
            {/* 테이블 헤더 */}
            <View style={styles.tableRow}>
              {tableHead.map((head, index) => (
                <Text key={index} style={styles.tableHeaderCell}>{head}</Text>
              ))}
            </View>
            {/* 테이블 데이터 */}
            {tableData.map((rowData, index) => (
              <View key={index} style={styles.tableRow}>
                {rowData.map((cellData, cellIndex) => (
                  <Text key={cellIndex} style={styles.tableCell}>{cellData}</Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
        
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
    flex: 0.8,
    padding: 20,
    marginTop: 50,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginMenu: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#eee',
    marginHorizontal: 30,
    marginTop: 10,
    borderRadius: 20,
  },
  loginMenuText: {
    fontSize: 22,
    textAlign: "center",
  },
  timeTable: {
    flex: 6,
    padding: 20,
  },
  timeTableText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    marginHorizontal: 20,
    backgroundColor: "#eee",
    padding: 10,
  },
  menuBox: {
    flex: 1.4,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    marginTop: 5,
  },
  route: {
    flexDirection: 'row',
    justifyContent: "space-around",
    marginTop: 10,
  },
  routeText: {
    fontSize: 14,
    backgroundColor: "#eee",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shuttleTable: {

  },
  bottomNav: {
    flex:1.08,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0000ff',
    padding: 10,
  },
  logo: {
    flex: 1,
    width: '100%',
  },
  tableContainer: {
    flex: 1,
    marginTop: 10,
    padding: 16,
    backgroundColor: '#fff',
  },
  table: {
    borderWidth: 1,
    borderColor: '#c1c0b9',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#c1c0b9',
    backgroundColor: '#f6f8fa',
  },
  tableHeaderCell: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderColor: '#c1c0b9',
    borderWidth: 1,
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
  },
  tableCell: {
    padding: 10,
    borderColor: '#c1c0b9',
    borderWidth: 1,
    flex: 1,
    textAlign: 'center',
  },
});

export default Home;
