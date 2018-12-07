import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native';
import Modal from 'react-native-modal';
import {history} from '../../App';

export default class VideoOption extends Component {
    constructor() {
        super();
        this.state = {
            isActionSheetVisible: false,
            activeVideoItem: 0,
            activeVideoAtIndex: 0,
        }
        this.showVideoOptions = this.showVideoOptions.bind(this);
        this.closeActionSheet = this.closeActionSheet.bind(this);
    }
    showVideoOptions(video_id, index) {
        this.setState({isActionSheetVisible: true, activeVideoItem: video_id, activeVideoAtIndex: index});
    }

    closeActionSheet() {
        this.setState({isActionSheetVisible: false});
    }

    render() {
        const actionMenus = [
            {name: 'WATCH', action: ()=>{
                this.props.onWatchVideo(this.state.activeVideoItem, this.state.activeVideoAtIndex);
            }},
            {name: 'LISTEN', action: ()=>{
                this.props.onListenVideoAtIndex(this.state.activeVideoAtIndex);
                this.setState({isActionSheetVisible: false});
            }},
            {name: 'DOWNLOAD', action: ()=>{
                this.props.onDownloadVideoAtIndex(this.state.activeVideoAtIndex);
                this.setState({isActionSheetVisible: false});
            }}
        ];

        if (this.props.canAddToLibrary(this.state.activeVideoAtIndex)) {
            actionMenus.push({name: 'ADD TO LIBRARY', action: () => {
                this.props.onAddToLibrary(this.state.activeVideoItem, this.state.activeVideoAtIndex);
                this.setState({isActionSheetVisible: false});
            }});
        }

        if (this.props.canRemoveFromLibrary && this.props.canRemoveFromLibrary()) {
            actionMenus.push({name: 'REMOVE', action: () => {
                this.props.onRemoveFromLibrary(this.state.activeVideoItem, this.state.activeVideoAtIndex);
                this.setState({isActionSheetVisible: false});
            }});
        }

        return (
            <Modal isVisible={this.state.isActionSheetVisible} onBackButtonPress={this.closeActionSheet} animationIn="fadeIn" animationOut="zoomOut" onBackdropPress={this.closeActionSheet} useNativeDriver={true}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#214158', width: 220, padding: 16, paddingBottom: 0}}>
                        {actionMenus.map((menu, index) => (
                            <TouchableHighlight style={{backgroundColor: '#bdbfc1', height: 44, marginBottom: 10, justifyContent: 'center'}} underlayColor="#8a8c8e" onPress={menu.action} key={index}>
                                <Text style={{color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '800'}}>{menu.name}</Text>
                            </TouchableHighlight>
                        ))}
                        <TouchableHighlight style={{height: 40, paddingBottom: 16, justifyContent: 'center'}} underlayColor="transparent" onPress={this.closeActionSheet}>
                            <Text style={{color: '#768691', textAlign: 'center', fontSize: 16}}>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }
}