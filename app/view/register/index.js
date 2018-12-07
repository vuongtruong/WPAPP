import React from 'react';
import {
    View,
    TouchableHighlight,
    TextInput,
    ActivityIndicator,
    Button,
    StyleSheet,
    ScrollView,
    Text
} from 'react-native';
import {Banner} from '../layout/banner';

const styles = StyleSheet.create({
    label: {color: "#000", fontSize: 16},
    input: {paddingLeft: 10}
});

const Register = (props) => {
    const {username, name, first_name, last_name, email, password} = props.user;
    return (
        <ScrollView style={{flex: 1, flexDirection: 'column'}} keyboardShouldPersistTaps="handled">{/*This is Main View*/}
            <Banner title="Register"/>
            <View style={{flex: 1, flexDirection: 'column', paddingLeft: 40, paddingRight: 40, paddingTop: 40, paddingBottom: 40}}>
                <View>
                    <Text style={styles.label}>Username:</Text><TextInput style={styles.input} autoCapitalize="none" placeholder="Enter your Username" onChangeText={text => props.onChangeText('username', text)} value={username}/>
                </View>
                <View>
                    <Text style={styles.label}>First Name:</Text><TextInput style={styles.input} placeholder="Enter your First Name" onChangeText={text => props.onChangeText('first_name', text)} value={first_name}/>
                </View>
                <View>
                    <Text style={styles.label}>Last Name:</Text><TextInput style={styles.input} placeholder="Enter your Last Name" onChangeText={text => props.onChangeText('last_name', text)} value={last_name}/>
                </View>
                <View>
                    <Text style={styles.label}>Email:</Text><TextInput style={styles.input} autoCapitalize="none" placeholder="Enter your Email" onChangeText={text => props.onChangeText('email', text)} value={email}/>
                </View>
                <View>
                    <Text style={styles.label}>Password:</Text><TextInput style={styles.input} autoCapitalize="none" secureTextEntry={true} placeholder="Enter your Password" onChangeText={text => props.onChangeText('password', text)} value={password}/>
                </View>
                <View>
                    {props.processing ?
                        <ActivityIndicator color="#214158" size="large"/>
                        :
                        <Button onPress={props.onRegister} title="Register" color="#214158"/>
                    }
                </View>
            </View>
        </ScrollView>
    );
}

export default Register;