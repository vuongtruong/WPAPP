import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Library} from '../../view/library/library';
import axios from 'axios';
import {getUrl} from '../core/setting';
import {history} from '../../App';
import {displayAlert} from '../core/alert';
import {Linking, View} from 'react-native';
import VideoOption from '../../view/library/video-option';
import {playMiniVideo} from '../core/actions';
import Toast from '../core/toast'

const PER_PAGE = 8;

class LibraryContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: [],
            page: 1,
            canLoadMore: true,
        };
        this.loading = false;
        this.processLoadMore = this.processLoadMore.bind(this);
        this.onOpenActionSheet = this.onOpenActionSheet.bind(this);
        this.onListenVideoAtIndex = this.onListenVideoAtIndex.bind(this);
        this.onDownloadVideoAtIndex = this.onDownloadVideoAtIndex.bind(this);
        this.canAddToLibrary = this.canAddToLibrary.bind(this);
        this.canRemoveFromLibrary = this.canRemoveFromLibrary.bind(this);
        this.onRemoveFromLibrary = this.onRemoveFromLibrary.bind(this);
        this.onWatchVideo = this.onWatchVideo.bind(this);
    }

    handleRequestError(res) {
        const {data} = res;
        if (data.code && data.code == '404') {
            if (data.message) {
                displayAlert(data.message);
            }
            this.setState({
                loading: false,
                canLoadMore: false
            });
            return false;
        }
        return true;
    }

    componentWillMount() {
        if (!this.props.logged_in) {
            displayAlert('You must be logged in first!');
            history.replace('/login');
        }
    }

    async processLoadMore() {
        if (!this.state.canLoadMore) return false;
        if (this.state.loading) return false;

        let nextPage = this.state.page + 1;
        this.setState({page: nextPage});
        this.loading = true;
        await axios.get(getUrl('video/user/' + this.props.user_id + '/library' + '?yn_custom_token=' + this.props.user_token), {
            params: {
                per_page: PER_PAGE,
                page: nextPage
            }
        })
        .then(res => {
            if (!this.handleRequestError(res)) {
                return;
            }
            const videos = res.data;
            if (!videos.length) {
                this.setState({canLoadMore: false});
                this.loading = false;
                return;
            }
            this.setState({videos: [...this.state.videos, ...videos]});
            this.loading = false;
        })
        .catch(error => {
            this.setState({canLoadMore: false});
            this.loading = false;
        });
        return true;
    }

    async componentDidMount() {
        if (!this.props.logged_in) {
            return;
        }
        this.loading = true;
        await axios.get(getUrl('video/user/' + this.props.user_id + '/library' + '?yn_custom_token=' + this.props.user_token), {
            params: {
                per_page: PER_PAGE,
                page: this.state.page
            }
        })
        .then(res => {
            if (!this.handleRequestError(res)) {
                return;
            }
            const videos = res.data;
            if (!videos.length) {
                this.setState({canLoadMore: false});
                this.loading = false;
                return;
            }
            this.setState({videos});
            this.loading = false;
        })
        .catch(error => {
            displayAlert('Cannot load data from server. Please make sure you have internet connection.');
            this.setState({canLoadMore: false})
            this.loading = false;
            console.log('error', error);
        });
    }

    onOpenActionSheet(id, index) {
        this.videoOption.showVideoOptions(id, index);
    }

    onListenVideoAtIndex(index) {
        this.props.onListenVideo(this.state.videos[index].video_id);
    }

    onDownloadVideoAtIndex(index) {
        const url = 'vnd.youtube://' + this.state.videos[index].video_id;
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

    canAddToLibrary(index) {
        return false;
    }

    canRemoveFromLibrary() {
        return true;
    }

    onRemoveFromLibrary(video_id, index) {
        axios.delete(getUrl('video/' + video_id + '/users/' + this.props.user_id + '?yn_custom_token=' + this.props.user_token))
        .then(res => {
            const {data} = res;
            if (data.code && data.code == '404') {
                data.message && displayAlert(data.message);
                return;
            }
            let videos = [...this.state.videos];
            videos.splice(index, 1);
            this.setState({videos});
            Toast.show('Removed successfully');
        })
        .catch(err => {
            displayAlert('An error occurred');
        })
    }

    onWatchVideo(video_id, index) {
        if (this.state.videos[index].type == 'spanish') {
            history.push('/spanish/detail/' + video_id);
        } else {
            history.push('/detail/' + video_id);
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Library
                    videos={this.state.videos}
                    load_more={this.processLoadMore}
                    onOpenActionSheet={this.onOpenActionSheet}
                    canLoadMore={this.state.canLoadMore}
                    />
                <VideoOption
                    ref={item => this.videoOption = item}
                    onListenVideoAtIndex={this.onListenVideoAtIndex}
                    onDownloadVideoAtIndex={this.onDownloadVideoAtIndex}
                    canAddToLibrary={this.canAddToLibrary}
                    canRemoveFromLibrary={this.canRemoveFromLibrary}
                    onRemoveFromLibrary={this.onRemoveFromLibrary}
                    onWatchVideo={this.onWatchVideo}
                    />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user_id: state.user.user_id,
    user_name: state.user.user_name,
    user_token: state.user.user_token,
    logged_in: state.user.logged_in
});
const mapDispatchToProps = dispatch => ({
    onListenVideo: video_id => {
        dispatch(playMiniVideo(video_id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LibraryContainer);