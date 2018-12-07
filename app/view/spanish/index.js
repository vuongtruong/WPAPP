import React from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    FlatList,
    TouchableHighlight
} from 'react-native';
import {VideoItem} from './video-item';
import {Banner} from '../layout/banner';
import {getCategories} from '../../container/helper/video';
import Modal from 'react-native-modal';

const renderItem = (onOpenActionSheet, {item: {title, length, id, speaker, feature_image, create_date, categories}, index}) => {
    let category_text = getCategories(categories);
    return (<VideoItem
        title={title}
        length={length}
        speaker={speaker}
        image={feature_image}
        create_date={create_date}
        id={id}
        category_text={category_text}
        onOpenActionSheet={onOpenActionSheet}
        index={index}
        />)
};

export default Spanish = function(props) {
    const bindedRenderItem = renderItem.bind(this, props.onOpenActionSheet);
    return (
        <View style={{flex: 1, flexDirection: 'column'}}>
            <FlatList 
                ListHeaderComponent={
                    <View>
                        <Banner title={props.title || 'Recent'} openDrawer={props.openDrawer}/>
                        {
                            !props.videos.length && !props.canLoadMore && (<Text style={{textAlign: 'center', paddingTop: 5}}>No items found.</Text>)
                        }
                    </View>
                }
                data={props.videos}
                renderItem={bindedRenderItem}
                keyExtractor={item => item.id.toString()}
                ListFooterComponent={
                    props.canLoadMore && <ActivityIndicator size="large" color="#214158" style={{marginTop: 5}} />
                }
                onEndReached={props.load_more}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
}