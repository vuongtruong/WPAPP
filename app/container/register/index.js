import React, {Component} from 'react';
import Register from '../../view/register';
import axios from 'axios';
import {displayAlert} from '../core/alert';
import {getUrl} from '../core/setting';
import {connect} from 'react-redux';
import {history} from '../../App';
import {setUserName, loggedIn, setUserId, setAuthToken} from '../core/actions';
import {STORAGE_USER_NAME, STORAGE_USER_ID, STORAGE_USER_TOKEN} from '../core/storage';
import {AsyncStorage, Keyboard} from 'react-native';
import Toast from '../core/toast';

class RegisterContainer extends Component{
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: '', 
                name: '',
                first_name: '',
                last_name: '', 
                email: '',
                roles: 'subscriber',
                password: ''
            },
            processing: false
        };
        this.onRegister = this.onRegister.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    /**
     * Validate inputs, make sure every text field was filled correctly
     */
    async validate() {
        const user = {...this.state.user}
        user.name = this.state.user.first_name + ' ' + this.state.user.last_name;
        await this.setState({user});
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.user.email)) {
            displayAlert('Please enter a valid email address');
            return false;
        }
        if (
            !this.state.user.username || !this.state.user.username.trim() ||
            !this.state.user.name || !this.state.user.name.trim() ||
            !this.state.user.first_name || !this.state.user.first_name.trim() ||
            !this.state.user.last_name || !this.state.user.last_name.trim() ||
            !this.state.user.email || !this.state.user.email.trim() ||
            !this.state.user.password || !this.state.user.password.trim()
        ) {
            displayAlert('Please fill all the fields')
            return false;
        }

        

        return true;
    }

    /**
     * Archive user info for long term usage
     * 
     * @param {number} user_id 
     * @param {string} user_name 
     * @param {string} user_token 
     */
    async archiveUserInfo(user_id, user_name, user_token) {
        try {
            await AsyncStorage.multiSet([[STORAGE_USER_ID, user_id], [STORAGE_USER_NAME, user_name], [STORAGE_USER_TOKEN, user_token]]);
        } catch (error) {
            console.log('AsyncStorage Error:', error);
        }
    }

    /**
     * Proceed registering when user clicks Register button
     */
    async onRegister() {
        Keyboard.dismiss();
        let that = this;
        const check = await this.validate();
        if (!check) {
            return;
        }
        if (this.state.processing) {
            return;
        }
        this.setState({processing: true})
        const post_data = this.state.user;
        await axios.post(getUrl('user'), post_data)
        .then(res => {
            const {data} = res;
            if (data.code) {
                displayAlert(data.message || 'Cannot load data from server');
                that.setState({processing: false});
                return;
            }
            if (data.ID) {
                Toast.show('Register successfully!');
                const user = data.data;
                that.props.onSetUserName(user.display_name);
                that.props.onSetUserId(user.ID);
                that.props.onSetAuthToken(user.yn_custom_token);
                that.props.onLoggedIn();
                that.archiveUserInfo(user.ID, user.display_name, user.yn_custom_token);
                history.replace('/');
            } else {
                that.setState({processing: false});
                return displayAlert('Cannot log in!');
            }
        })
        .catch(err => {
            displayAlert('An error occurred');
            console.log('error', err);
            this.setState({processing: false});
        });
    }

    /**
     * Handle input data for user
     * 
     * @param {string} field_name property name of user state to update respectively
     * @param {string} text new text to update user state
     */
    onChangeText(field_name, text) {
        const user = {...this.state.user}
        user[field_name] = text
        this.setState({user})
    }

    render() {
        return (
            <Register
                user={this.state.user}
                onChangeText={this.onChangeText}
                onRegister={this.onRegister}
                processing={this.state.processing}
                />
        )
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
    return {
        onSetUserName: user_name => {
            dispatch(setUserName(user_name));
        },
        onLoggedIn: () => {
            dispatch(loggedIn());
        },
        onSetUserId: user_id => {
            dispatch(setUserId(user_id));
        },
        onSetAuthToken: token => dispatch(setAuthToken(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);