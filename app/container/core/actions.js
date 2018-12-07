export const SET_USER_ID = 'SET_USER_ID';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';
export const SET_USER_NAME = 'SET_USER_NAME';

export const SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD';

export const SET_MINI_VIDEO = 'SET_MINI_VIDEO';
export const PLAY_MINI_VIDEO = 'PLAY_MINI_VIDEO';
export const STOP_MINI_VIDEO = 'STOP_MINI_VIDEO';

/* User authentication */
export function setUserId(user_id) {
    return {type: SET_USER_ID, user_id}
}
export function setAuthToken(token) {
    return {type: SET_AUTH_TOKEN, token}
}
export function loggedIn() {
    return {type: LOGGED_IN}
}
export function loggedOut() {
    return {type: LOGGED_OUT}
}
export function setUserName(user_name) {
    return {type: SET_USER_NAME, user_name}
}

/* Main search feature */
export function setSearchKeyword(text) {
    return {type: SET_SEARCH_KEYWORD, text}
}

/* Minivideo for 'Listen' feature */
export function setMiniVideo(id) {
    return {type: SET_MINI_VIDEO, id}
}
export function playMiniVideo(id) {
    return {type: PLAY_MINI_VIDEO, id}
}
export function stopMiniVideo() {
    return {type: STOP_MINI_VIDEO}
}