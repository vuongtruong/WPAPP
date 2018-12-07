import React from "react";
import {
    View,
    Text,
    ImageBackground,
    StyleSheet
} from 'react-native';
import {Link} from 'react-router-native';

const textProps = {
    numberOfLines: 1
};

export const VideoItem = (props) => (
    <Link to={'/detail/' + props.id}>
        <View>
            <View style={styles.video_item}>
                <View style={styles.flex_row}>
                    <View style={styles.video_thumbnail}>
                        <ImageBackground source={{uri: props.image}} style={{flex: 1}}>
                        </ImageBackground>
                    </View>
                    <View style={styles.video_brief_detail}>
                        <Text numberOfLines={2} style={styles.video_title}>{props.title}</Text>
                        <Text {...textProps}>{props.speaker}</Text>
                        <Text {...textProps}>{props.category_text}</Text>
                        <Text {...textProps}>{props.length}   {props.create_date}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.topic_divider}></View>
        </View>
    </Link>
);

const styles = StyleSheet.create({
    flex_row: {flex: 1, flexDirection: 'row'},
    video_item: {height: 110, backgroundColor: '#ffffff'},
    video_title: {fontSize: 16, fontWeight: '500', height: 40, color: '#214158'},
    video_thumbnail: {width: 140, padding: 10},
    video_brief_detail: {flex: 1, padding: 5, paddingLeft: 10},
    topic_divider: {height: 1, backgroundColor: "#E0E0E0"},
});