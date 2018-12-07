import React from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableHighlight,
    StyleSheet,
    Alert,
    AsyncStorage,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Link} from 'react-router-native';
import {connect} from 'react-redux';
import {loggedOut, setUserName, setSearchKeyword} from '../../container/core/actions';
import {STORAGE_USER_ID, STORAGE_USER_NAME, STORAGE_USER_TOKEN} from '../../container/core/storage';
import PropTypes from 'prop-types';
import {displayAlert} from '../../container/core/alert';
import {history} from '../../App';
import Toast from '../../container/core/toast';

const MenuGroup = (props) => (
    <View style={styles.menu_group}>
        <Text style={styles.menu_group__title}>{props.title}</Text>
    </View>
);

class SlideMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: '',
            search_opacity: 1,
        }

        this.onChangeSearchKey = this.onChangeSearchKey.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.cleanSearch = this.cleanSearch.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
    }

    static contextTypes = {
        drawer: PropTypes.shape({
            openDrawer: PropTypes.func,
            closeDrawer: PropTypes.func
        })
    }

    componentDidMount() {
        this.unlisten = history.listen((location, action) => {
            this.cleanSearch();
            if (location.pathname == '/' || location.pathname == '/spanish' || location.pathname.substr(0,21) == '/spanish/video_topic/' || location.pathname.substr(0,13) == '/video_topic/') {
                this.state.search_opacity || this.setState({search_opacity: 1});
            } else {
                !this.state.search_opacity || this.setState({search_opacity: 0});
            }
        })
    }

    componentWillUnmount() {
        this.unlisten();
    }

    onChangeSearchKey(text) {
        this.setState({keyword: text});
    }

    onSearchSubmit() {
        this.props.changeSearchKey(this.state.keyword);
        this.context.drawer.closeDrawer();
        // if (history.location.pathname != '/') {
        //     history.push('/');
        // }
    }

    cleanSearch() {
        this.setState({keyword: ''});
        this.props.changeSearchKey('');
    }

    closeDrawer() {
        let that = this;
        setTimeout(()=> {
            that.context.drawer.closeDrawer()
        }, 200);
    }

    render() {
        const MenuItem = (props) => {
            const align_left = props.alignIconLeft ? props.alignIconLeft : 0;
        
            return (
                <Link to={props.to} underlayColor="#d7d7d7" onPress={() => {props.alertMessage && displayAlert(props.alertMessage); this.closeDrawer()}}>
                    <View style={styles.menu_item_wrapper}>
                        <View style={styles.flex_row}>
                            <View style={styles.menu_item_icon__rounded}>
                                <View style={[styles.menu_item_icon__center, {paddingLeft: align_left}]}>
                                    <Icon name={props.iconName} color="#214158" size={16} />
                                </View>
                            </View>
                            <Text style={styles.menu_item_text}>{props.title}</Text>
                        </View>
                    </View>
                </Link>
            )
        };

        return (
            <View style={[styles.mainContainer, styles.flex_column]}>
                <View style={[styles.searchWrapper, {opacity: this.state.search_opacity}]}>
                    <View style={styles.search__view}>
                        <TextInput style={styles.search__input}
                            placeholder="🔎 Search Lectures"
                            autoCorrect={false}
                            underlineColorAndroid="rgba(0,0,0,0)"
                            onChangeText={text => this.onChangeSearchKey(text)}
                            onSubmitEditing={this.onSearchSubmit}
                            value={this.state.keyword}
                            />
                        {!!this.state.keyword && 
                        <TouchableHighlight underlayColor="transparent" onPress={this.cleanSearch} style={{position: "absolute", left: 200, justifyContent: 'center', width: 28, height: 28}}>
                            <Icon name="remove" color="#000" size={16} style={{width: 28, textAlign: 'center'}}/>
                        </TouchableHighlight>
                        }
                    </View>
                </View>
                <MenuGroup title="ENGLISH"/>
                <View style={styles.menu_group_content}>
                    <MenuItem title="Recent" to="/" iconName="play" alignIconLeft={3} />
                    <MenuItem title="Topics" to="/topic" iconName="list-ul" />
                </View>
                <MenuGroup title="SPANISH"/>
                <View style={styles.menu_group_content}>
                    <MenuItem title="Recent" to="/spanish" iconName="play" alignIconLeft={3} />
                    <MenuItem title="Topics" to="/spanish/topic" iconName="list-ul" />
                </View>
                <MenuGroup title="ACCOUNT"/>
                <View style={styles.menu_group_content}>
                {
                    this.props.logged_in && <MenuItem title="My Library" to="/library" iconName="film" />
                }
                {this.props.logged_in && <MenuItem title="Settings" to="/setting" iconName="gear"/>}
                {
                    this.props.logged_in ?
                    <TouchableHighlight style={styles.menu_item_wrapper} underlayColor="#d7d7d7" onPress={() => this.props.onLogout(this.context.drawer.closeDrawer)}>
                        <View style={styles.flex_row}>
                            <View style={styles.menu_item_icon__rounded}>
                                <View style={styles.menu_item_icon__center}>
                                    <Icon name="lock" color="#214158" size={16} />
                                </View>
                            </View>
                            <Text style={styles.menu_item_text}>Logout</Text>
                        </View>
                    </TouchableHighlight>
                    :
                    <MenuItem title="Login" to="/login" iconName="lock"/>
                }
                </View>
                {this.props.user_name && <Text style={{position: 'absolute', bottom: 5, right: 5, width: 150, height: 34, textAlignVertical: 'bottom', textAlign: 'right', color: '#fff'}}>@{this.props.user_name}</Text>}
            </View>
        );
    } 
}

const mapStateToProps = state => {
    return {
        logged_in: state.user.logged_in,
        user_name: state.user.user_name,
        search: state.search.keyword
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: (cb) => {
            Alert.alert(
                'Confirm',
                'Are you sure you want to log out?',
                [
                    {text: 'Cancel', onPress: () => {}},
                    {text: 'OK', onPress: () => {
                        dispatch(setUserName(null));
                        dispatch(loggedOut());
                        // Clean local storage
                        try {
                            AsyncStorage.multiRemove([STORAGE_USER_NAME, STORAGE_USER_ID, STORAGE_USER_TOKEN]);
                        } catch (error) {
                            console.log('AsyncStorage Error:', error);
                        }
                        Toast.show('You are logged out!');
                        history.push('/');
                        cb();
                    }},
                ],
                { cancelable: false }
            );
        },
        changeSearchKey: text => {
            dispatch(setSearchKeyword(text));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SlideMenu);

const styles = StyleSheet.create({
    mainContainer: Platform.select({
        ios: { backgroundColor: '#214158', paddingTop: 10 },
        android: { backgroundColor: '#214158' }
    }),
    flex_column: { flex: 1, flexDirection: 'column' },
    flex_row: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    searchWrapper: { height: 70 },
    search__view: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 20},
    search__input: {backgroundColor: '#ffffff', width: 180, height: 40, paddingLeft: 10},
    menu_group: {height: 30, backgroundColor: '#d7d7d7', justifyContent: 'center'},
    menu_group__title: {textAlignVertical: 'center', paddingLeft: 20, fontSize: 16},
    menu_group_content: {paddingTop: 7, paddingBottom: 7},
    menu_item_wrapper: {paddingLeft: 20, height: 36, paddingBottom: 3, paddingTop: 3},
    menu_item_icon__rounded: {width: 30, backgroundColor: '#ffffff', borderRadius: 15},
    menu_item_icon__center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    menu_item_text: {fontSize: 16, color: '#ffffff', textAlignVertical: 'center', paddingLeft: 10}
});