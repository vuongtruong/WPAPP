import React from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Platform,
    ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {Banner} from '../layout/banner';
import YouTube from 'react-native-youtube';
import BackLink from '../../container/core/back-link';
import {Route} from 'react-router-native';
import Comment from '../../container/detail/comment';
import {history} from '../../App';

const Touchable = Platform.select({
    ios: () => require('react-native').TouchableHighlight,
    android: () => require('react-native').TouchableNativeFeedback,
})();

const textProps = {
    numberOfLines: 1
};

export const Detail = function(props) {
    return (
        <ScrollView style={{flex: 1, flexDirection: 'column'}} keyboardShouldPersistTaps='always'>{/*This is Main View*/}
            <Banner title="" openDrawer={props.openDrawer}/>
            {
                props.show_loading ? (<ActivityIndicator size="large" color="#214158" style={{marginTop: 5}} />) : (
                    <View style={styles.main_container}>
                        <View style={styles.video_wrapper}>
                            <View style={styles.flex_row}>
                                <BackLink style={{width: 60, marginLeft: -10}}>
                                    <View style={styles.flex_row_justify}>
                                        <EvilIcon name="chevron-left" size={28} color="#000000" style={{width: 20}}></EvilIcon>
                                        <Text style={{color: "#000000", fontSize: 16}}>Back</Text>
                                    </View>
                                </BackLink>
                                <View style={{flex: 1}}></View>
                                <View style={{width: 80, paddingRight: 20}}>
                                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <Touchable onPress={props.onShareVideo} underlayColor="transparent">
                                            <View>
                                                <MIcon name="share" color="#000000" size={24} style={{paddingRight: 5, paddingLeft: 5}}/>
                                            </View>
                                        </Touchable>
                                        <Touchable underlayColor="transparent" onPress={props.onDownloadVideo}>
                                            <View>
                                                <MIcon name="file-download" color="#000000" size={24} style={{paddingLeft: 5, paddingRight: 5}}/>
                                            </View>
                                        </Touchable>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{height: 20, marginBottom: 10}}>
                            <Text style={{flex: 1, textAlignVertical: 'center', color: "#214158", fontWeight: '800', fontSize: 16}}>{props.video.speaker}</Text>
                        </View>
                        {/* <ImageBackground source={{uri: props.video.feature_image}} style={{height: 220}}></ImageBackground> */}
                        <YouTube videoId={props.video.video_id} style={{height: props.video_height}} play={false} fullscreen={false} loop={true} controls={1} apiKey="AIzaSyBq3SszdRXfhIxRZFI_6CBACRjv_2b6CE0" />
                        <View style={styles.tab_wrapper}>
                            <View style={styles.flex_row}>
                                <Touchable underlayColor="#214158" style={props.current_tab == 'INFO' ? styles.tab_active : styles.tab_inactive} onPress={() => {props.setActiveTab('INFO');history.replace('/detail/' + props.video.id)}}><Text style={styles.tab_title}>Info</Text></Touchable>
                                <Touchable underlayColor="#214158" style={props.current_tab == 'COMMENT' ? styles.tab_active : styles.tab_inactive} onPress={() => {props.setActiveTab('COMMENT');history.replace('/detail/' + props.video.id + '/comment')}}><Text style={styles.tab_title_inactive}>Comments</Text></Touchable>
                            </View>
                        </View>
                        <Route exact path="/detail/:id" component={() => (
                            <View style={styles.video_info_wrapper}>
                                <View style={[styles.info_item_row, styles.info_item_row_text_wrap]}>
                                    <Text style={styles.info_title}>Title:</Text>
                                    <Text style={styles.info_value}>{props.video.title}</Text>
                                </View>
                                <View style={styles.info_item_row}>
                                    <Text style={styles.info_title}>Speaker:</Text>
                                    <Text style={styles.info_value} {...textProps}>{props.video.speaker}</Text>
                                </View>
                                <View style={[styles.info_item_row, styles.info_item_row_text_wrap]}>
                                    <Text style={styles.info_title}>Topic:</Text>
                                    <Text style={styles.info_value}>{props.video.category_text}</Text>
                                </View>
                                <View style={styles.info_item_row}>
                                    <Text style={styles.info_title}>Length:</Text>
                                    <Text style={styles.info_value} {...textProps}>{props.video.length}</Text>
                                </View>
                                <View style={styles.info_item_row}>
                                    <Text style={styles.info_title}>Date:</Text>
                                    <Text style={styles.info_value} {...textProps}>{props.video.create_date}</Text>
                                </View>
                                <View style={styles.info_item_row}>
                                    <Text style={[styles.info_title, styles.text_narrow]}>In Dedication of:</Text>
                                    <Text style={styles.info_value} {...textProps}>{props.video.in_dedication_of}</Text>
                                </View>
                                <View style={styles.info_item_row}>
                                    <Text style={[styles.info_title, styles.text_narrow]}>In Celebration of:</Text>
                                    <Text style={styles.info_value} {...textProps}>{props.video.in_celebration_of}</Text>
                                </View>
                            </View>
                        )}/>
                        <Route path="/detail/:id/comment" component={Comment}/>
                    </View>
                )
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    main_container: {flex: 1, flexDirection: 'column', paddingLeft: 10, paddingRight: 10, paddingBottom: 24},
    video_wrapper: {height: 32, marginTop: 10},
    flex_row: {flex: 1, flexDirection: 'row'},
    flex_row_justify: {flex: 1, flexDirection: 'row', alignItems: 'center'},
    video_info_wrapper: {marginTop: 10},
    info_item_row: {height: 26, flexDirection: 'row'},
    info_title: {fontSize: 16, fontWeight: '800', width: 120, textAlignVertical: 'center'},
    text_narrow: {letterSpacing: -1},
    info_value: {fontSize: 16, fontWeight: '400', textAlignVertical: 'center', flex: 1},
    tab_active: {flex: 1, backgroundColor: "#214158", justifyContent: 'center'},
    tab_inactive: {flex: 1, backgroundColor: "#e0e0e0", justifyContent: 'center'},
    tab_title: {color: "#ffffff", textAlign: "center", fontSize: 16},
    tab_title_inactive: {color: "#ffffff", textAlign: "center", fontSize: 16},
    tab_wrapper: {height: 32, marginTop: 10},
    info_item_row_text_wrap: {height: null, minHeight: 26}
});