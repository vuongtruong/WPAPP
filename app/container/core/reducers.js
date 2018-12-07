import {combineReducers} from 'redux';

import {
    SET_USER_ID,
    SET_AUTH_TOKEN,
    LOGGED_IN,
    LOGGED_OUT,
    SET_USER_NAME,
    SET_SEARCH_KEYWORD,
    SET_MINI_VIDEO,
    PLAY_MINI_VIDEO,
    STOP_MINI_VIDEO
} from './actions'

/* For user authentication */
function user(state = {}, action) {
    switch (action.type) {
        case SET_USER_ID: 
            return {...state, user_id: action.user_id}
        case SET_AUTH_TOKEN:
            return {...state, user_token: action.token}
        case LOGGED_IN:
            return {...state, logged_in: true}
        case LOGGED_OUT:
            return {...state, logged_in: false}
        case SET_USER_NAME:
            return {...state, user_name: action.user_name}
        default:
            return state;
    }
}

/* For global search feature */
function search(state = {}, action) {
    switch (action.type) {
        case SET_SEARCH_KEYWORD:
            return {...state, keyword: action.text}
        default:
            return state;
    }
}

/* For 'Listen' feature */
function mini_video(state = {}, action) {
    switch (action.type) {
        case SET_MINI_VIDEO:
            return {...state, video_id: action.id}
        case PLAY_MINI_VIDEO:
            return {...state, video_id: action.id, show_video: true}
        case STOP_MINI_VIDEO:
            return {...state, show_video: false}
        default:
            return state;
    }
}

export const globalUser = combineReducers({user, search, mini_video});