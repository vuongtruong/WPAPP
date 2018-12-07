import React, {Component} from 'react';
import {
    AsyncStorage,
    Keyboard
} from 'react-native';
import {Login} from '../../view/login/login';
import axios from 'axios';
import {getUrl} from '../core/setting';
import {displayAlert} from '../core/alert';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {setUserName, loggedIn, setUserId, setAuthToken} from '../core/actions';
import {STORAGE_USER_NAME, STORAGE_USER_ID, STORAGE_USER_TOKEN} from '../core/storage';
import Toast from '../core/toast';

const INVALID_USERNAME = 'invalid_username';
const INVALID_PASSWORD = 'incorrect_password';

class LoginContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: '',
            password: '',
            processing: false
        };
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }

    static contextTypes = {
        router: PropTypes.shape({
          history: PropTypes.shape({
            goBack: PropTypes.func.isRequired
          }).isRequired
        }).isRequired
    };

    // componentDidMount() {
    //     Toast.show('Removed dasfas adsf asdf successfully');
    // }

    onChangeUserName(user_name) {
        this.setState({user_name});
    }

    onChangePassword(password) {
        this.setState({password});
    }

    async archiveUserInfo(user_id, user_name, user_token) {
        try {
            await AsyncStorage.multiSet([[STORAGE_USER_ID, user_id], [STORAGE_USER_NAME, user_name], [STORAGE_USER_TOKEN, user_token]]);
        } catch (error) {
            console.log('AsyncStorage Error:', error);
        }
    }

    validate() {
        if (!this.state.user_name || !this.state.user_name.trim()
            || !this.state.password || !this.state.password.trim()) {
                displayAlert('Username and Password are required')
            return false;
        }
        return true;
    }

    onLogin() {
        if (this.state.processing) {
            return;
        }
        Keyboard.dismiss();
        if (!this.validate()) {
            return;
        }
        this.setState({processing: true})
        // Get data
        let that = this;
        axios.post(getUrl('login'), {
            username: this.state.user_name,
            password: this.state.password
          })
          .then(function (response) {
              const {data} = response;
            if (data.ID) {
                Toast.show('Logged in successfully!');
                const user = data.data;
                that.setState({user});
                that.props.onSetUserName(user.display_name);
                that.props.onSetUserId(user.ID);
                that.props.onSetAuthToken(user.yn_custom_token);
                that.props.onLoggedIn();
                that.archiveUserInfo(user.ID, user.display_name, user.yn_custom_token);
                that.context.router.history.replace('/');
            } else {
                that.setState({processing: false});
                return displayAlert('Cannot log in!');
            }
        })
        .catch(function (error) {
            /* Handle login differently */
            if (error.response) {
                const {response} = error;
                console.log('Error response', response);
                if (response.data && response.data.code) {
                    switch (response.data.code) {
                        case INVALID_USERNAME:
                            displayAlert('Username is not correct');
                            break;
                        case INVALID_PASSWORD:
                            displayAlert('Password is not correct');
                            break;
                        default:
                            displayAlert('An error occurred');
                    }
                } else {
                    displayAlert('An error occurred');
                }
            } else {
                displayAlert('Cannot log in! Please check your internet connection');
            }
            that.setState({processing: false});
          });
        // Hard code data
        // const data = JSON.parse(`{"data":{"ID":"3","user_login":"Tan Nguyen","user_pass":"$P$BNl0mlJaTa8hFdeDAoi7NRYZcA9MCx.","user_nicename":"tan-nguyen","user_email":"tannn@younetco.com","user_url":"","user_registered":"2018-06-15 04:04:02","user_activation_key":"","user_status":"0","display_name":"Tan Nguyen","yn_custom_token":"84379VGFuIE5ndXllbg==-84379VmgjU0hgRzUmfEBLOF1YKiU4OW1uYi5pOCV8cTFxZnU9WTlZOS9iVip5UShwU0xxO0Q2JGNyZ0QjfjZiaExYKw==-84379JlZQIW90S0RUVWdQZ2JrbA==-1529397360-Mw=="},"ID":3,"caps":{"subscriber":true},"cap_key":"wp_capabilities","roles":["subscriber"],"allcaps":{"read":true,"level_0":true,"subscriber":true},"filter":null}`);
    }

    onRegister() {
        this.context.router.history.push('/register');
    }

    render() {
        return (
            <Login
                onChangePassword={this.onChangePassword}
                onChangeUserName={this.onChangeUserName}
                onLogin={this.onLogin}
                username={this.state.user_name}
                password={this.state.password}
                processing={this.state.processing}
                onRegister={this.onRegister}
                />
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.logged_in
    };
}

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

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);