import React from 'react';
import {Alert} from 'react-native';

export const displayAlert = (message) => {
    Alert.alert(
        'Warning',
        message,
        [
            {text: 'OK', onPress: () => {}},
        ],
        { cancelable: false }
    );
}

export const displayError = (message) => {
    Alert.alert(
        'Error',
        message,
        [
            {text: 'OK', onPress: () => {}},
        ],
        { cancelable: false }
    );
}