import React, {Component} from 'react';
import {Recent} from '../../view/recent/recent';
import axios from 'axios';
import {getUrl} from '../core/setting';
import {displayAlert} from '../core/alert';
import {connect} from 'react-redux';
import {playMiniVideo} from '../core/actions';
import {Linking, View} from 'react-native';
import VideoOption from '../../view/recent/video-option';
import Toast from '../core/toast';

const DEFAULT_PARAMS = {
    order: 'DESC',
    sort: 'date',
    per_page: 8
};

class RecentContainer extends Component{
    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            page: 1,
            refreshing: null,
            canLoadMore: true,
        };
        this.loading = false;
        this.processLoadMore = this.processLoadMore.bind(this);
        this.onOpenActionSheet = this.onOpenActionSheet.bind(this);
        this.onAddToLibrary = this.onAddToLibrary.bind(this);
        this.initFirstLoading = this.initFirstLoading.bind(this);
        this.onListenVideoAtIndex = this.onListenVideoAtIndex.bind(this);
        this.onDownloadVideoAtIndex = this.onDownloadVideoAtIndex.bind(this);
        this.canAddToLibrary = this.canAddToLibrary.bind(this);
    }

    initFirstLoading() {
        this.loading = true;
        axios.get(getUrl('videos'), {
            params: {
                page: this.state.page,
                ...DEFAULT_PARAMS,
                search: this.props.search,
                yn_custom_token: this.props.user_token
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
        this.initFirstLoading();
    }

    async processLoadMore() {
        if (!this.state.canLoadMore) return false;
        if (this.loading) return false;

        let nextPage = this.state.page + 1;
        this.setState({page: nextPage});
        this.loading = true;
        await axios.get(getUrl('videos'), {
            params: {
                page: nextPage,
                ...DEFAULT_PARAMS,
                search: this.props.search,
                yn_custom_token: this.props.user_token
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

    /**
     * Add video to Library
     */
    onAddToLibrary(video_id, index) {
        axios.post(getUrl('video/' + video_id + '/users/' + this.props.user_id), {
            yn_custom_token: this.props.user_token,
            video_id: video_id,
            user_id: this.state.user_id
        })
        .then(res => {
            const {data} = res;
            if (data.code && (data.code == '404' || data.code == '409')) {
                displayAlert(data.message || 'An error occurred');
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

    onListenVideoAtIndex(index) {
        this.props.onListenVideo(this.state.videos[index].video_id);
    }

    onDownloadVideoAtIndex(index) {
        const url = 'vnd.youtube://' + this.state.videos[index].video_id;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                displayAlert('Please install Youtube app to proceed with offline video mode.');
            } else {
                return Linking.openURL(url).catch(err => console.error('An error occurred', err));;
            }
        }).catch(error => {
            console.log('An error occurred', error);
            displayAlert('An error occurred');
        });
    }

    canAddToLibrary(index) {
        if (this.props.logged_in && this.state.videos[index] && this.state.videos[index].exist == 0) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Recent {...this.props}
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
                    onAddToLibrary={this.onAddToLibrary}
                    />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        user_token: state.user.user_token,
        user_id: state.user.user_id,
        search: state.search.keyword,
        logged_in: state.user.logged_in
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onListenVideo: video_id => {
            dispatch(playMiniVideo(video_id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecentContainer);