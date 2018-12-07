import React from 'react';
import {
    View,
    Text,
    Button,
    Image,
    ImageBackground,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import {Banner} from '../../layout/banner';
import {Link} from 'react-router-native';

const TopicItem = (props) => (
    <View>
        <Link to={'/spanish/video_topic/' + props.id} underlayColor="#d7d7d7">
            <View style={styles.topic_wrapper}>
                <View style={styles.col_flex}><Text style={styles.topic_title}>{props.title}</Text></View>
                <View style={styles.col_right}><Text style={styles.topic_video_count}>{props.count} Videos</Text><Icon name="chevron-right" color="#214158" size={28} /></View>
            </View>
        </Link>
        <View style={styles.topic_divider}></View>
    </View>
);

const styles = StyleSheet.create({
    topic_wrapper: {minHeight: 28, flexDirection: 'row', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, alignItems: 'center'},
    topic_divider: {height: 1, backgroundColor: "#E0E0E0", marginLeft: 10, marginRight: 10},
    col_right: {width: 110, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'},
    col_flex: {flex: 1},
    topic_title: {fontSize: 16, color: '#214158', fontWeight: '800'},
    topic_video_count: {textAlign: 'right'}
});

export const Topic = function(props) {
    return (
        <ScrollView style={{flex: 1, flexDirection: 'column'}}>{/*This is Main View*/}
            <Banner title="Spanish/Topics"/>
            <View style={{flex: 1, flexDirection: 'column'}}>
                {props.topics.map(({name, count, term_id}, index) => (
                    <TopicItem title={name} count={count} id={term_id} key={index}/>
                ))}
                {
                    !props.topics.length && !props.show_loading && (<Text style={{textAlign: 'center', paddingTop: 5}}>No items found.</Text>)
                }
                {
                    props.show_loading && (<ActivityIndicator size="large" style={{paddingTop: 5}} color="#214158" />)
                }
            </View>
        </ScrollView>
    );
}