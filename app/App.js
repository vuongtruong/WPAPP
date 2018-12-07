import React, { Component, createContext } from 'react';
import {
  AsyncStorage,
  View,
  Platform
} from 'react-native';
import SlideMenu from './view/layout/menu3';
import Routers from './container/core/router';
import {Router} from 'react-router-native';
import {createMemoryHistory} from 'history';
import {createStore} from 'redux';
import {globalUser} from './container/core/reducers';
import {Provider} from 'react-redux';
import PropTypes from 'prop-types';
import {setUserName, setUserId, loggedIn, setAuthToken, loggedOut} from './container/core/actions';
import {STORAGE_USER_NAME, STORAGE_USER_ID, STORAGE_USER_TOKEN} from './container/core/storage';
import SplashScreen from 'react-native-splash-screen';
import MiniVideo from './container/mini-video';
import { getUrl } from './container/core/setting';
import { displayAlert } from './container/core/alert';
import axios from 'axios';

const DrawerLayout = Platform.select({
  ios: () => require('react-native-drawer-layout').default,
  android: () => require('react-native').DrawerLayoutAndroid,
})();

const initialState = {
  user: {
    user_id: 0,
    user_name: null
  },
  search: {
    keyword: null
  },
  mini_video: {
    video_id: null,
    show_video: false
  }
};
const store = createStore(globalUser, initialState);

export const history = createMemoryHistory({
  initialEntries: ['/'],
  initialIndex: 0,
  keyLength: 6,
  // getUserConfirmation: null
});

export const DrawerContext = React.createContext(null);

export default class App extends Component {

  static childContextTypes = {
    drawer: PropTypes.shape({
      openDrawer: PropTypes.func,
      closeDrawer: PropTypes.func
    })
  }

  constructor(props) {
    super(props);

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);

    this.state = {
      show_video_mini: false,
      listening_video_id: '',
      initializing: true
    }
  }

  async componentDidMount() {
    // Get login data from local memory
    try {
      const user_name = await AsyncStorage.getItem(STORAGE_USER_NAME);
      const user_id = await AsyncStorage.getItem(STORAGE_USER_ID);
      const auth_token = await AsyncStorage.getItem(STORAGE_USER_TOKEN);
      if (user_name !== null && user_name != '' && user_id !== null && user_id != 0) {
        store.dispatch(setUserName(user_name));
        store.dispatch(setUserId(user_id));
        store.dispatch(setAuthToken(auth_token));
        store.dispatch(loggedIn());
        this.checkValidToken(auth_token);
      }
    } catch (error) {
      console.log('AsyncStorage Error:', error);
    }
    this.setState({initializing: false});
    SplashScreen.hide();
  }

  /**
   * Check current token if it is valid or not
   * 
   * @param {string} auth_token User token
   */
  async checkValidToken(auth_token) {
    axios.get(getUrl('token-check/?yn_custom_token=' + auth_token))
    .then(res => {
      let valid = true;
      const {data} = res;
      if (data) {
        if (data.code && data.code == '404') {
          valid = false;
        } else if (!data.length) {
          valid = false;
        }
      } else {
        displayAlert('An error occurred');
      }

      if (!valid) {
        displayAlert('Your user session has been expired. Please login again');
        try {
          store.dispatch(setUserName(null));
          store.dispatch(loggedOut());
          AsyncStorage.multiRemove([STORAGE_USER_NAME, STORAGE_USER_ID, STORAGE_USER_TOKEN]);
        } catch (error) {
            console.log('AsyncStorage Error:', error);
        }
        history.push('/login');
      }
    })
    .catch(err => {
      displayAlert('Cannot load data from server');
      console.log('err', err);
    });
  }

  getChildContext() {
    return {
      drawer: {
        openDrawer: this.openDrawer,
        closeDrawer: this.closeDrawer
      }
    }
  }

  openDrawer() {
    this.refs['mainDrawer'].openDrawer();
  }
  closeDrawer() {
    this.refs['mainDrawer'].closeDrawer();
  }

  render() {
    // Wait util all the user data is fetched from system
    if (this.state.initializing) {
      return null;
    }
    return (
      <Provider store={store}>
        <Router history={history}>
          <DrawerContext.Provider value={{openDrawer: this.openDrawer, closeDrawer: this.closeDrawer}}>
            <DrawerLayout
              ref='mainDrawer'
              drawerWidth={250}
              drawerPosition={DrawerLayout.positions.Right}
              renderNavigationView={() => (
                <SlideMenu />
              )}>
              <View style={{flex: 1}}>
                <Routers />
                <MiniVideo/>
              </View>
            </DrawerLayout>
          </DrawerContext.Provider>
        </Router>
      </Provider>
    );
  }
}
