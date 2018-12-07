import React from 'react';
import {
    View,
    Text,
    Button,
    Image,
    ImageBackground,
    StyleSheet,
    ScrollView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {DrawerContext} from '../../App';

export const Banner = (props) => (
    <ImageBackground source={require('../../image/header-background.png')} style={styles.background_banner}>{/*Header bar*/}
        <View style={styles.flex_row}>
            <View style={styles.app_logo}>{/*Logo*/}
                <ImageBackground source={require('../../image/logo.png')} style={{flex: 1}}>
                </ImageBackground>
            </View>
            <View style={styles.flex_center}>
                <View>
                    <Text style={styles.banner_title} numberOfLines={1}>{props.title}</Text>
                </View>
            </View>
            <View style={{width: 60, position: 'absolute', right: 0}}>
                <DrawerContext.Consumer>
                    {control => (
                        <Icon.Button name="navicon" size={30} color="#ffffff" onPress={()=>{control.openDrawer();}} backgroundColor="transparent"></Icon.Button>
                    )}
                </DrawerContext.Consumer>
            </View>
        </View>
    </ImageBackground>
);

const styles = StyleSheet.create({
    background_banner: Platform.select({
        ios: {height: 160, paddingTop: 10},
        android: {height: 150}
    }),
    flex_row: {flex: 1, flexDirection: 'row'},
    flex_center: {flex: 1, justifyContent: 'center', paddingRight: 10},
    app_logo: {width: 120, paddingLeft: 30, paddingTop: 15, paddingBottom: 15, paddingRight: 10},
    banner_title: {fontSize: 30, textAlign: 'center', color: '#214158', fontWeight: '800'}
});