import React from "react";
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {Link} from 'react-router-native';

const textProps = {
    numberOfLines: 1
};

export const VideoItem = (props) => {
    const url = (props.type == 'spanish' ? '/spanish/detail/' : 'detail/') + props.id;
    return (
    <Link to={url} onLongPress={()=>{props.onOpenActionSheet(props.id, props.index)}} delayLongPress={200}>
        <View>
            <View style={styles.video_item}>
                <View style={styles.flex_row}>
                    <View style={styles.video_thumbnail}>
                        <ImageBackground source={{uri: props.image}} style={{flex: 1}}>
                        </ImageBackground>
                    </View>
                    <View style={styles.video_brief_detail}>
                        <Text numberOfLines={2} style={styles.video_title}>{props.title}</Text>
                        <Text {...textProps} style={styles.video_info}>{props.speaker}</Text>
                        <Text {...textProps} style={styles.video_info}>{props.category_text}</Text>
                        <Text {...textProps} style={styles.video_info}>{props.length}   {props.create_date}</Text>
                        <TouchableHighlight style={{position: 'absolute', top: 5, right: 5, padding: 5}} onPress={()=>{props.onOpenActionSheet(props.id, props.index)}} underlayColor="transparent"><Icon name="dots-three-vertical" size={16} color="#000000"/></TouchableHighlight>
                    </View>
                </View>
            </View>
            <View style={styles.topic_divider}></View>
        </View>
    </Link>
)
};

const styles = StyleSheet.create({
    flex_row: {flex: 1, flexDirection: 'row'},
    video_item: {height: 110, backgroundColor: '#ffffff'},
    video_title: {fontSize: 16, fontWeight: '900', height: 40, color: '#214158', paddingRight: 20, paddingTop: 2},
    video_thumbnail: {width: 140, padding: 10},
    video_brief_detail: {flex: 1, padding: 5, paddingLeft: 10},
    topic_divider: {height: 1, backgroundColor: "#E0E0E0"},
    video_info: {lineHeight: 20}
});