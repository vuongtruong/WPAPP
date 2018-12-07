import React, {Component} from 'react';
import {
    Animated
} from 'react-native';

export default class VideoItemContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeIn: Animated.Value(0)
        }
    }

    componentDidMount() {
        Animated.timing(this.state.fadeIn, {
            toValue: 1
        }).start();
    }

    render() {
        const propsToPopulate = {children, ...rest} = this.props;
        const childWithProps = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, rest);
        });
        return (
            <Animated.View style={{opacity: this.state.fadeIn}}>
                {this.props.children(this.props)}
            </Animated.View>
        );
    }
}