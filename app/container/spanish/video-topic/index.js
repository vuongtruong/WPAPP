import React, {Component} from 'react';
import Spanish from '../../../view/spanish';
import axios from 'axios';
import {getUrl} from '../../core/setting';
import {displayAlert} from '../../core/alert';
import {playMiniVideo} from '../../core/actions';
import {Linking, View} from 'react-native';
import {connect} from 'react-redux';
import VideoOption from '../../../view/library/video-option';
import {history} from '../../../App'
import Toast from '../../core/toast';

const PER_PAGE = 8;

class VideoTopicContainer extends Component{
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            videos: [],
            category: {},
            page: 1,
            error: null,
            refreshing: null,
            canLoadMore: true,
            title: 'Topic'
        };
        this.loading = false;
        this.processLoadMore = this.processLoadMore.bind(this);
        this.onOpenActionSheet = this.onOpenActionSheet.bind(this);
        this.onAddToLibrary = this.onAddToLibrary.bind(this);
        this.onListenVideoAtIndex = this.onListenVideoAtIndex.bind(this);
        this.onDownloadVideoAtIndex = this.onDownloadVideoAtIndex.bind(this);
        this.canAddToLibrary = this.canAddToLibrary.bind(this);
    }

    initFirstLoading() {
        this.loading = true;

        axios.get(getUrl('spanish/category', this.state.id) + '/list', {
            params: {
                per_page: PER_PAGE,
                page: this.state.page,
                search: this.props.search
            }
        })
        .then(res => {
            const videos = res.data;
            if (!videos.length) {
                this.setState({canLoadMore: false});
            } else {
                this.setState({videos});
            }
            this.loading = false;
        })
        .catch(error => {
            displayAlert('Cannot load data from server. Please make sure you have internet connection.');
            this.setState({canLoadMore: false})
            this.loading = false;
        });
    }

    componentDidMount() {
        // Get parent category info fist
        axios.get(getUrl('spanish/category', this.state.id))
        .then(res => {
            const category = res.data;
            this.setState({category, title: category.name});
        })
        .catch(error => {
            displayAlert('Cannot load data from server. Please make sure you have internet connection.');
        });
        
        this.initFirstLoading();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.search != prevProps.search) {
            await this.setState({
                videos: [],
                canLoadMore: true,
                page: 1
            });
            this.initFirstLoading();
        }
    }

    async processLoadMore() {
        if (!this.state.canLoadMore) return false;
        if (this.loading) return false;

        let nextPage = this.state.page + 1;
        this.setState({page: nextPage});
        this.loading = true;
        await axios.get(getUrl('spanish/category', this.state.id) + '/list', {
            params: {
                per_page: PER_PAGE,
                page: nextPage,
                search: this.props.search
            }
        })
        .then(res => {
            const videos = res.data;
            if (!videos.length) {
                this.setState({canLoadMore: false});
            } else {
                this.setState({videos: [...this.state.videos, ...videos]});
            }
            this.loading = false;
        })
        .catch(error => {
            this.setState({canLoadMore: false})
            this.loading = false;
        });
        return true;
    }

    onOpenActionSheet(id, index) {
        this.videoOption.showVideoOptions(id, index);
    }

    onAddToLibrary(video_id, index) {
        axios.post(getUrl('video/' + video_id + '/users/' + this.props.user_id), {
            yn_custom_token: this.props.user_token,
            video_id: video_id,
            user_id: this.state.user_id
        })
        .then(res => {
            const {data} = res;
            if (data.code && data.code == '404') {
                data.message && displayAlert(data.message);
                return;
            }
            Toast.show('Added to Library successfully');
            const videos = this.state.videos;
            videos[index].exist = 1;
            this.setState({videos});
        })
        .catch(err => {
            console.log('Add to library', err);
            displayAlert('An error occurred');
        })
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

    canAddToLibrary(index) {console.log('videos', this.state.videos[index]);
        if (this.props.logged_in && this.state.videos[index] && !!this.state.videos[index].exist == false) {
            return true;
        }
        return false;
    }

    onWatchVideo(video_id, index) {
        history.push('/spanish/detail/' + video_id);
    }

    render() {

        return (
            <View style={{flex: 1}}>
                <Spanish {...this.props}
                    videos={this.state.videos}
                    load_more={this.processLoadMore}
                    title={this.state.title}
                    onOpenActionSheet={this.onOpenActionSheet}
                    canLoadMore={this.state.canLoadMore}
                    />
                <VideoOption
                    ref={item => this.videoOption = item}
                    onListenVideoAtIndex={this.onListenVideoAtIndex}
                    onDownloadVideoAtIndex={this.onDownloadVideoAtIndex}
                    canAddToLibrary={this.canAddToLibrary}
                    onAddToLibrary={this.onAddToLibrary}
                    onWatchVideo={this.onWatchVideo}
                    />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user_token: state.user.user_token,
        user_id: state.user.user_id,
        logged_in: state.user.logged_in,
        search: state.search.keyword
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onListenVideo: video_id => {
            dispatch(playMiniVideo(video_id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoTopicContainer);