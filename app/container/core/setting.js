export const BASE_URL = 'http://demo2.younetco.com/ctadlib/behereandbeyond/wp-json/wp/v2/';

export const getUrl = (url, id) => {return BASE_URL + url + (id ? '/' + id : '')};

export const THEME_COLOR = "#214158";

export const YOUTUBE_API_KEY = "AIzaSyBq3SszdRXfhIxRZFI_6CBACRjv_2b6CE0";

export const TOAST_STYLE_IOS = {
    backgroundColor: "#214158",
    height: 30,
    color: "#ffffff",
    borderRadius: 15,
    borderColor: '#275375',
    borderWidth: 1
};