import React, {Component} from 'react';
import {connect} from 'react-redux';
import Comment from '../../view/detail/comment';
import axios from 'axios';
import {getUrl} from '../core/setting';
import {displayAlert} from '../core/alert';
import { Keyboard} from 'react-native';
import qs from 'qs';
import Toast from '../core/toast';

class CommentContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            comments: [],
            loading: false,
            post: '',
            show_send_button: false
        }
        this.onChangeText = this.onChangeText.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }
    
    async componentDidMount() {
        this.setState({loading: true});
        await axios.get(getUrl('comments/' + this.state.id + '/post'))
        .then(res => {
            const comments = res.data;
            this.setState({comments, loading: false});
        })
        .catch(error => {
            this.setState({loading: false});
            displayAlert('Cannot load data from server.');
        });
    }

    onChangeText(text) {
        this.setState({post: text});
        if (text.trim()) {
            this.setState({show_send_button: true});
        } else {
            this.setState({show_send_button: false});
        }
    }

    submitComment() {
        Keyboard.dismiss();
        if (this.state.loading) {
            return;
        }
        this.setState({loading: true, show_send_button: false});
        axios.post(getUrl('videos/' + this.state.id + '/comments'), qs.stringify({
            comment_post_ID: this.state.id,
            user_id: this.props.user_id,
            comment_content: this.state.post
        }))
        .then(response => {
            const {data} = response;
            if (data.code && data.code == '404') {
                data.message && displayAlert(data.message);
                return;
            }
            this.setState({post: ''});
            Toast.show('Comment added successfully')
            this.componentDidMount();
        })
        .catch(error => {
            displayAlert('Can not load data from server');
            this.setState({show_send_button: true});
            console.log('submitComment error', error);
        })
        .then(() => {
            this.setState({loading: false});
        });
    }

    render() {
        return (
            <Comment
                comments={this.state.comments}
                onChangeText={this.onChangeText}
                show_send_button={this.state.show_send_button}
                comment_text={this.state.post}
                submitComment={this.submitComment}
                loading={this.state.loading}
                can_add_comment={this.props.logged_in}
                />
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.user_token,
    user_id: state.user.user_id,
    logged_in: state.user.logged_in
})
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(CommentContainer)