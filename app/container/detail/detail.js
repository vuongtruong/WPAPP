import React, {Component} from 'react';
import {Detail} from '../../view/detail/detail';
import axios from 'axios';
import {getCategories} from '../helper/video';
import {getUrl} from '../core/setting';
import { displayAlert } from '../core/alert';
import Share from 'react-native-share';
import {Linking} from 'react-native';
import {connect} from 'react-redux';
import {stopMiniVideo} from '../core/actions';

class DetailContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            show_loading: true,
            video: {},
            current_tab: 'INFO',
            video_height: 220
        };
        this.setActiveTab = this.setActiveTab.bind(this);
        this.onShareVideo = this.onShareVideo.bind(this);
        this.onDownloadVideo = this.onDownloadVideo.bind(this);
    }

    async componentDidMount() {
        await axios.get(getUrl('videos', this.state.id))
        .then(res => {
            const video = res.data;
            video.category_text = getCategories(video.categories);
            this.setState({video, show_loading: false});
        })
        .catch(error => {
            this.setState({show_loading: false});
            displayAlert('Cannot load data from server.');
        });

        setTimeout(() => {
            this.setState({video_height: 221});
        }, 1000);
    }

    setActiveTab(tab) {
        this.setState({current_tab: tab});
    }

    onShareVideo() {
        const options = {
            url: 'https://www.youtube.com/watch?v=' + this.state.video.video_id,
            message: '',
            title: this.state.video.title,
            subject: this.state.video.title
        };
        Share.open(options)
        .then(res => console.log(res))
        .catch(err => {
            err && console.log(err);
        });
    }

    onDownloadVideo() {
        // Users have to use the offline video mode of Youtube App
        const url = 'vnd.youtube://' + this.state.video.video_id;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                displayAlert('Please install Youtube app to proceed with offline video mode.');
            } else {
                return Linking.openURL(url);
            }
        }).catch(error => {
            console.log('An error occurred', error);
            displayAlert('An error occurred');
        });
    }

    componentWillMount() {
        this.props.stopMiniVideo();
    }

    render() {
        return (
            <Detail
                show_loading={this.state.show_loading}
                video={this.state.video}
                current_tab={this.state.current_tab}
                setActiveTab={this.setActiveTab}
                onShareVideo={this.onShareVideo}
                onDownloadVideo={this.onDownloadVideo}
                video_height={this.state.video_height}
                />
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    stopMiniVideo: () => {
        dispatch(stopMiniVideo());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailContainer)