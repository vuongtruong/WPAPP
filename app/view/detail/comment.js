import React from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    FlatList,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CommentItem = ({id, author, date, content, user_id}) => (
    <View style={{paddingTop: 5}}>
        <Text style={{width: 80, fontWeight: '600', color: '#214158', position: 'absolute', top: 5, left: 5}}>@{author}</Text>
        <View style={{backgroundColor: '#E0E0E0', padding: 3, marginLeft: 90, paddingLeft: 5, paddingRight: 5, borderRadius: 10, marginTop: 10}}>
            <Text style={{lineHeight: 20}} multiline={true}>{content}</Text>
        </View>
        <View style={{position: 'absolute', left: 85, top: 15, width: 0, height: 0, borderTopWidth: 15, borderTopColor: '#E0E0E0', borderLeftWidth: 15, borderLeftColor: 'transparent', zIndex: -1}}></View>
    </View>
);


const Comment = (props) => {
    const renderFooter = () => {
        if (!props.loading) return null;
        return (<ActivityIndicator size="large" color="#214158" style={{marginTop: 5}} />);
    }
    
    return (
    <View style={styles.comment_section}>
        {props.can_add_comment ? (<View>
                <Text style={styles.label}>Leave a comment</Text>
            <TextInput style={styles.comment_input} placeholder="Comment..." multiline={true} numberOfLines={3} onChangeText={text => props.onChangeText(text)} value={props.comment_text}/>
            <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
            {
                props.show_send_button && (<TouchableHighlight style={{width: 30, height: 30, backgroundColor: '#4CAF50', position: 'relative', width: 35, height: 35, top: -40, right: 5, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center'}} onPress={props.submitComment} underlayColor="#2E7D32">
                    <Icon name="send" color="#fff" size={20} style={{marginLeft: -5}}/>
                </TouchableHighlight>)
            }
            </View>
            </View>)
            : (
                <Text style={styles.label}>Please login to leave comments</Text>
            )
        }
        <FlatList 
            style={{paddingLeft: 10}}
            data={props.comments} 
            renderItem={({item}) => (
                <CommentItem id={item.comment_ID} author={item.comment_author} date={item.comment_date} content={item.comment_content} user_id={item.user_id} />
            )}
            keyExtractor={item => item.comment_ID.toString()}
            ListFooterComponent={renderFooter}
            // onEndReached={props.load_more}
        />
    </View>
)}

const styles = StyleSheet.create({
    comment_section: {paddingTop: 5, paddingBottom: 10},
    label: {color: '#214158', fontWeight: '800', paddingBottom: 5},
    comment_input: {backgroundColor: '#E0E0E0', minHeight: 70, fontSize: 16, padding: 2}
});

export default Comment;