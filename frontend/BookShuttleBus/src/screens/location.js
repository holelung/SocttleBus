import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Wrapper } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';



const LocationScreen = ({navigation}) => {
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [location, setLocation] = useState(null);

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = async() =>{
        // 권한 요청
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        // 현재 위치 가져오기
        let currentLocation = await Location.getCurrentPositionAsync({});
        
        setLocation(currentLocation.coords);
    };

    if (!location) {
        // 위치 정보가 없으면 로딩 메시지 표시
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

   return (
    <View style={styles.container}>
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            provider={PROVIDER_GOOGLE}
        >
        <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={"내위치"}
            description={"내 현재위치"}
        />
        </MapView>



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
    },
    map: {
        width: '100%',
        height: '90%',
    },

    bottomNav: {
        position: "absolute",
        bottom: 0,
        width: '100%',
        height: '10%',
        backgroundColor: '#0000ff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    }
});

export default LocationScreen; 