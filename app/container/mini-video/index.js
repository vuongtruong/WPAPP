import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import {YOUTUBE_API_KEY} from '../core/setting';
import YouTube from 'react-native-youtube';
import Icon from 'react-native-vector-icons/FontAwesome';
import {stopMiniVideo} from '../core/actions';

class MiniVideo extends Component {
    constructor(props) {
        super(props);
        this.handleReady = this.handleReady.bind(this);
        this.handleStop = this.handleStop.bind(this);

        this.state = {
            width: 200
        }
    }

    handleReady() {
        let that = this;
        if (Platform.OS == 'android') {
            setTimeout(() => {
                that.player.setPlay(true);
                that.setState({width: 201})
            }, 1000);
        }
    }

    handleStop() {
        this.props.stopMiniVideo();
    }

    componentDidUpdate(prevProps) {
        if (this.props.show_mini_video != prevProps.show_mini_video) {
            if (!this.props.show_mini_video) {
                this.setState({width: 200});
            }
        }
    }

    render() {
        if (!this.props.show_mini_video || !this.props.video_id) {
            return null;
        }

        return (
            <View style={{position: 'absolute', width: this.state.width, height: 110, bottom: 0, right: 0}}>
                <YouTube
                    videoId={this.props.video_id}
                    style={{flex: 1}}
                    play={Platform.OS == 'android' ? false : true}
                    fullscreen={false}
                    loop={true}
                    apiKey={YOUTUBE_API_KEY}
                    controls={1}
                    ref={item => this.player = item}
                    onReady={this.handleReady}
                    showFullscreenButton={false}
                    />
                <TouchableHighlight style={{width: 30, height: 30, position: 'absolute', right: 0, top: -30, backgroundColor: '#FF3D00', justifyContent: 'center'}} underlayColor="transparent" onPress={this.handleStop}>
                    <Icon name="close" size={20} color="#000" style={{textAlign: 'center'}}/>
                </TouchableHighlight>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    video_id: state.mini_video.video_id,
    show_mini_video: state.mini_video.show_video
});
const mapDispatchToProps = dispatch => ({
    stopMiniVideo: () => {dispatch(stopMiniVideo())}
});

export default connect(mapStateToProps, mapDispatchToProps)(MiniVideo);