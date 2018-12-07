import React, {Component} from 'react';
import {
    Alert
} from 'react-native';
import {Topic} from '../../../view/spanish/topic';
import axios from 'axios';
import {getUrl} from '../../core/setting';
import {displayAlert} from '../../core/alert';

export default class TopicContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topics: [],
            show_loading: true
        };
    }

    async componentDidMount() {
        await axios.get(getUrl('spanish/category'))
        .then(res => {
            const topics = res.data; 
            this.setState({topics, show_loading: false});
        })
        .catch(error => {
            displayAlert('Cannot load data from server. Please make sure you have internet connection.');
            this.setState({show_loading: false})
        });;
    }

    render() {
        return (
            <Topic show_loading={this.state.show_loading} topics={this.state.topics}/>
        );
    }
}