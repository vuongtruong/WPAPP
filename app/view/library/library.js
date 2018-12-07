import React from 'react';
import {
    View,
    ScrollView,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableHighlight
} from 'react-native';
import {VideoItem} from './video-item';
import {Banner} from '../layout/banner';
import {getCategories} from '../../container/helper/video';
import Modal from 'react-native-modal';

export const Library = function(props) {
    return (
        <View style={{flex: 1, flexDirection: 'column'}}>
            <FlatList 
                data={props.videos} 
                ListHeaderComponent={
                    <View>
                        <Banner title="My Library" openDrawer={props.openDrawer}/>
                        {
                            !props.videos.length && !props.canLoadMore && (<Text style={{textAlign: 'center', paddingTop: 5}}>No items found.</Text>)
                        }
                    </View>
                }
                renderItem={({item: {title, length, id, speaker, feature_image, create_date, categories, type}, index}) => {
                    let category_text = getCategories(categories);
                    return (<VideoItem
                        title={title}
                        length={length}
                        speaker={speaker}
                        image={feature_image}
                        create_date={create_date}
                        id={id}
                        category_text={category_text}
                        index={index}
                        onOpenActionSheet={props.onOpenActionSheet}
                        type={type}
                        />)
                }}
                keyExtractor={item => item.id.toString()}
                ListFooterComponent={
                    props.canLoadMore && <ActivityIndicator size="large" color="#214158" style={{marginTop: 5}} />
                }
                onEndReached={props.load_more}
            />
        </View>
    );
}