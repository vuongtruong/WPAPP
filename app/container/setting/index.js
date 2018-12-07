import React, {Component} from 'react';
import Setting from '../../view/setting';
import {
    AsyncStorage,
    Keyboard
} from 'react-native';
import {displayAlert} from '../core/alert';
import axios from 'axios';
import {getUrl} from '../core/setting';
import {connect} from 'react-redux';
import {history} from '../../App';
import {setAuthToken} from '../core/actions';
import {STORAGE_USER_ID, STORAGE_USER_NAME, STORAGE_USER_TOKEN} from '../core/storage';
import Toast from '../core/toast';

class SettingContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: '',
                first_name: '',
                last_name: '',
                description: '',
                nickname: '',
            },
            processing: false,
            show_required: false,
            data_ready: false,
            show_password_modal: false,
            password: {
                old_password: '',
                new_password: '',
                confirm_password: ''
            },
            processing_password: false
        }
        this.onChangeText = this.onChangeText.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onToggleChangePassword = this.onToggleChangePassword.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onUpdatePassword = this.onUpdatePassword.bind(this);
    }

    /**
     * Validate data before proceeding update, make sure first_name and last_name are not empty
     */
    async validate() {
        if (
            !this.state.user.name || !this.state.user.name.trim() ||
            !this.state.user.first_name || !this.state.user.first_name.trim() ||
            !this.state.user.last_name || !this.state.user.last_name.trim()
        ) {
            displayAlert('Please fill all the required fields')
            this.setState({show_required: true})
            return false;
        }

        await this.setState({user: {...this.state.user, nickname: this.state.user.name}})

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
     * Handle text change
     * 
     * @param {string} field_name
     * @param {string} text 
     */
    onChangeText(field_name, text) {
        const user = {...this.state.user}
        user[field_name] = text
        this.setState({user})
    }

    /**
     * Handle update tapping
     */
    async onUpdate() {
        let that = this;
        Keyboard.dismiss();
        const check = await this.validate();
        if (!check) {
            return;
        }
        if (this.state.processing) {
            return;
        }
        this.setState({processing: true});
        const sendData = {...this.state.user, yn_custom_token: this.props.user_token};
        axios.post(getUrl('user/' + this.props.user_id + '/update'), sendData)
        .then(res => {
            const {data} = res;
            if (data.code && data.code == '404') {
                displayAlert(data.message || 'Cannot load data from server')
                console.log('data', data);
                this.setState({processing: false});
                return;
            }
            Toast.show('Updated successfully');
            this.setState({processing: false});
            // history.goBack();
        })
        .catch(error => {
            displayAlert('Cannot load data from server')
            this.setState({processing: false});
        });
    }

    componentDidMount() {
        /* Check if user is able to access setting page */
        if (!this.props.isLoggedIn) {
            displayAlert('Please login first');
            history.push('/login');
            return;
        }
        /* Get current user information */
        axios.get(getUrl('user/' + this.props.user_id + '/info'))
        .then(res => {
            const {data} = res;
            if (data.code && data.code == '404') {
                displayAlert(data.message || 'Cannot load data from server');
                history.goBack();
                return;
            }
            const user = {...this.state.user};
            data.display_name && (user.name = data.display_name);
            data.first_name && (user.first_name = data.first_name);
            data.last_name && (user.last_name = data.last_name);
            data.description && (user.description = data.description);
            data.user_nicename && (user.nickname = data.user_nicename);

            this.setState({user, data_ready: true});
        })
        .catch(err => {
            displayAlert('Cannot load data from server')
            console.log('error', err);
            history.goBack();
        });
    }

    onToggleChangePassword(display) {
        this.setState({show_password_modal: display});
    }

    onChangePassword(field_name, text) {
        const {password} = this.state;
        password[field_name] = text;
        this.setState({password});
    }

    validatePassword() {
        if (!this.state.password.old_password || !this.state.password.old_password.trim()
            || !this.state.password.new_password || !this.state.password.new_password.trim()) {
            displayAlert('Please fill in all the fields');
            return false;
        }
        if (this.state.password.new_password != this.state.password.confirm_password) {
            displayAlert('Your confirm password is incorrect');
            return false;
        }
        if (this.state.password.old_password == this.state.password.new_password) {
            displayAlert('Please enter a NEW password other than using the old one')
            return false;
        }
        return true;
    }

    onUpdatePassword() {
        Keyboard.dismiss();
        if (!this.validatePassword()) {
            return;
        }
        this.setState({processing_password: true});
        axios.post(getUrl('user/' + this.props.user_id + '/change-password?yn_custom_token=' + this.props.user_token), this.state.password)
        .then(res => {
            const {data} = res;
            console.log('change password data', data);
            if (data.code && data.code == '404') {
                displayAlert(data.message || 'An error occurred');
                this.setState({processing_password: false});
                return;
            }
            Toast.show('Password changed successfully');
            this.setState({show_password_modal: false});
            if (data.token) {
                this.props.updateUserToken(data.token);
                AsyncStorage.setItem(STORAGE_USER_TOKEN, data.token);
            }
        })
        .catch(err => {
            displayAlert('Cannot load data from server');
            console.log('change password error', err);
        })
        .then(() => {
            this.setState({processing_password: false});
        });
    }

    render() {
        return (
            <Setting
                user={this.state.user}
                processing={this.state.processing}
                onChangeText={this.onChangeText}
                onUpdate={this.onUpdate}
                show_required={this.state.show_required}
                data_ready={this.state.data_ready}
                show_password_modal={this.state.show_password_modal}
                onToggleChangePassword={this.onToggleChangePassword}
                password={this.state.password}
                onChangePassword={this.onChangePassword}
                processing_password={this.state.processing_password}
                onUpdatePassword={this.onUpdatePassword}
                />
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.logged_in,
    user_id: state.user.user_id,
    user_token: state.user.user_token
})

const mapDispatchToProps = dispatch => ({
    updateUserToken: (token) => {
        dispatch(setAuthToken(token));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer);