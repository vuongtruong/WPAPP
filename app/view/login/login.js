import React from 'react';
import {
    View,
    Text,
    Button,
    Image,
    ImageBackground,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Platform
} from 'react-native';
import {Banner} from '../layout/banner';

const styles = StyleSheet.create(Platform.select({
    ios: {
        label: {color: "#000", fontSize: 16, marginTop: 10, marginBottom: 10},
        input: {paddingLeft: 10}
    },
    android: {
        label: {color: "#000", fontSize: 16},
        input: {paddingLeft: 10}
    }
}));

export const Login = function(props) {
    return (
        <ScrollView style={{flex: 1, flexDirection: 'column'}} keyboardShouldPersistTaps="handled">{/*This is Main View*/}
            <Banner title="Login"/>
            <View style={{flex: 1, flexDirection: 'column', paddingLeft: 40, paddingRight: 40, paddingTop: 40}}>
                <View>
                    <Text style={styles.label}>Username:</Text><TextInput style={styles.input} autoCapitalize="none" placeholder="Enter your Username" onChangeText={text=>props.onChangeUserName(text)} value={props.username}/>
                </View>
                <View>
                    <Text style={styles.label}>Password:</Text><TextInput style={styles.input} autoCapitalize="none" secureTextEntry={true} placeholder="Enter your Password" onChangeText={text=>props.onChangePassword(text)} value={props.password}/>
                </View>
                <View>
                    {props.processing ?
                        <ActivityIndicator color="#214158" size="large"/>
                    :
                        <View>
                            <Button onPress={props.onLogin} title="Login" color="#214158"/>
                            <Text style={{textAlign: 'center'}}>or</Text>
                            <Button onPress={props.onRegister} title="Register" color="#2E7D32"/>
                        </View>
                    }
                </View>
            </View>
        </ScrollView>
    );
}