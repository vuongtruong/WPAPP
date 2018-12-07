import React from 'react';
import { Route, Switch, BackButton } from 'react-router-native';
import {View} from 'react-native';
import Recent from '../recent/recent';
import Topic from '../topic/topic';
import Detail from '../detail/detail';
import VideoTopic from '../video-topic';
import Login from '../login/login';
import Library from '../library/library';
import Register from '../register';
import Setting from '../setting';
import Spanish from '../spanish';
import SpanishTopic from '../spanish/topic';
import SpanishVideoTopic from '../spanish/video-topic';
import SpanishVideoDetail from '../spanish/detail';

const DefaultProps = {
};

class Routers extends React.Component {
    render() {
        return (
            // For now, should not use Switch
            <BackButton>
                <Route exact path="/" component={Recent} {...DefaultProps.scene}/>
                <Route path="/topic" component={Topic} {...DefaultProps.scene}/>
                <Route path="/detail/:id" component={Detail} {...DefaultProps.scene}/>
                <Route path="/library" component={Library} {...DefaultProps.scene}/>
                <Route path="/video_topic/:id" component={VideoTopic} {...DefaultProps.scene}/>
                <Route path="/login" component={Login} {...DefaultProps.scene}/>
                <Route path="/register" component={Register} {...DefaultProps.scene}/>
                <Route path="/setting" component={Setting} {...DefaultProps.scene}/>
                <Route exact path="/spanish" component={Spanish} {...DefaultProps.scene}/>
                <Route path="/spanish/topic" component={SpanishTopic} {...DefaultProps.scene}/>
                <Route path="/spanish/video_topic/:id" component={SpanishVideoTopic} {...DefaultProps.scene}/>
                <Route path="/spanish/detail/:id" component={SpanishVideoDetail} {...DefaultProps.scene}/>
            </BackButton>
        )
    }
}

export default Routers;