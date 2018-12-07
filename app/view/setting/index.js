import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    TextInput,
    Button,
    ActivityIndicator,
    TouchableNativeFeedback
} from 'react-native';
import {Banner} from '../layout/banner';
import Modal from 'react-native-modal';

const HIGHLIGHT_COLOR = "#1976d2";
const HIGHLIGHT_RED = '#c62828';

class UserInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightColor: '#000',
            labelColor: '#898989'
        }
        this._onFocus = () => {
            this.setState({highlightColor: HIGHLIGHT_COLOR, labelColor: HIGHLIGHT_COLOR});
        }
        this._onEndEditing = () => {
            this.setState({highlightColor: '#000', labelColor: '#898989'});
        }
    }

    static defaultProps = {
        secureTextEntry: false,
        show_required: false
    }

    componentDidUpdate(prevProps) {
        if (this.props.show_required && !this.props.value && this.state.highlightColor != HIGHLIGHT_RED) {
            this.setState({highlightColor: HIGHLIGHT_RED, labelColor: HIGHLIGHT_RED});
        }
    }

    render() {
        return (
            <View>
                <Text style={{fontSize: 14, color: this.state.labelColor}}>{this.props.label}</Text>
                <TextInput
                    placeholder={this.props.placeholder}
                    style={{fontSize: 18, color: '#000'}}
                    underlineColorAndroid={this.state.highlightColor}
                    onFocus={this._onFocus}
                    onEndEditing={this._onEndEditing}
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    secureTextEntry={this.props.secureTextEntry}
                    autoCapitalize={this.props.secureTextEntry ? 'none' : 'sentences'}
                    />
            </View>
        );
    }
}

const Setting = (props) => {
    return (
        <ScrollView style={{flex: 1, flexDirection: 'column'}} keyboardShouldPersistTaps="handled">{/*This is Main View*/}
            <Banner title="Settings"/>
            <View style={{flex: 1, flexDirection: 'column', padding: 40}}>
                {props.data_ready ?
                <View>
                    <UserInput label="Display Name" placeholder="Enter Your Display Name" value={props.user.name} onChangeText={text => props.onChangeText('name', text)} show_required={props.show_required}/>
                    <UserInput label="First Name" placeholder="Enter Your First Name" value={props.user.first_name} onChangeText={text => props.onChangeText('first_name', text)} show_required={props.show_required}/>
                    <UserInput label="Last Name" placeholder="Enter Your Last Name" value={props.user.last_name} onChangeText={text => props.onChangeText('last_name', text)} show_required={props.show_required}/>
                    <UserInput label="Description" placeholder="Introduce Your Self" value={props.user.description} onChangeText={text => props.onChangeText('description', text)}/>
                    {/* <UserInput label="Nickname" placeholder="Enter Your Nickname" value={props.user.nickname} onChangeText={text => props.onChangeText('nickname', text)}/> */}
                    <TouchableNativeFeedback onPress={()=>{props.onToggleChangePassword(true)}} background={TouchableNativeFeedback.SelectableBackground()}>
                        <View style={{padding: 5, marginBottom: 15, borderRadius: 5, borderColor: '#c7c7c7', borderWidth: 1, width: 150}}>
                            <Text style={{color: '#2196f3', textAlign: 'center'}}>CHANGE PASSWORD</Text>
                        </View>
                    </TouchableNativeFeedback>
                    {props.processing ?
                        <ActivityIndicator color="#214158" size="large"/>
                    :
                        <View>
                            <Button onPress={props.onUpdate} title="Update" color="#214158"/>
                        </View>
                    }
                </View>
                :
                <ActivityIndicator color="#214158" size="large"/>
                }
            </View>
            <Modal
                isVisible={props.show_password_modal}
                onBackButtonPress={()=>props.onToggleChangePassword(false)}
                animationIn="slideInUp"
                animationInTiming={500}
                animationOutTiming={500}
                animationOut="slideOutDown"
                >
                <View style={{backgroundColor: '#fff', borderRadius: 6, padding: 20}}>
                    <UserInput label="Current Password" placeholder="Enter your current password" secureTextEntry={true} value={props.password.old_password} onChangeText={text => props.onChangePassword('old_password', text)}/>
                    <UserInput label="New Password" placeholder="Enter your new password" secureTextEntry={true} value={props.password.new_password} onChangeText={text => props.onChangePassword('new_password', text)}/>
                    <UserInput label="Confirm Password" placeholder="Confirm your new password" secureTextEntry={true} value={props.password.confirm_password} onChangeText={text => props.onChangePassword('confirm_password', text)}/>
                    {props.processing_password ?
                        <ActivityIndicator color="#214158" size="large"/>
                    :
                        <View>
                            <Button onPress={props.onUpdatePassword} title="Update" color="#214158"/>
                        </View>
                    }
                </View>
            </Modal>
        </ScrollView>
    );
}

export default Setting;