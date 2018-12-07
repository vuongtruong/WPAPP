import React, { Component } from "react";
import PropTypes from "prop-types";
import {Platform} from "react-native";
const Touchable = Platform.select({
  ios: () => require('react-native').TouchableHighlight,
  android: () => require('react-native').TouchableNativeFeedback,
})();

class BackLink extends Component {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        goBack: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  static propTypes = {
    onPress: PropTypes.func,
    component: PropTypes.func,
  };

  static defaultProps = {
    component: Touchable,
  };

  handlePress = event => {
    if (this.props.onPress) this.props.onPress(event);
    
    if (!event.defaultPrevented) {
      const { history } = this.context.router;
      history.goBack();
    }
  };

  render() {
    const { component: Component, ...rest } = this.props;
    return <Component underlayColor="#d7d7d7" {...rest} onPress={this.handlePress} />;
  }
}

export default BackLink;
