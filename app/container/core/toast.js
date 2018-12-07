import {ToastAndroid, Platform} from 'react-native';
import ToastIOS from 'react-native-toast-native';
import {TOAST_STYLE_IOS} from './setting';

const Toast = {
    show: (msg) => {
        if (Platform.OS == 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
            var textWidth = msg.length * 14 * 0.575 + 1 / msg.length * 500;
            ToastIOS.show(msg, ToastIOS.SHORT, ToastIOS.BOTTOM, {...TOAST_STYLE_IOS, width: textWidth});
        }
    }
}

export default Toast;