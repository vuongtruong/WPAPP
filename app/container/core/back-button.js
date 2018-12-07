import React, { Component } from "react";
import PropTypes from "prop-types";
import { BackHandler, View } from "react-native";
import {connect} from "react-redux";

// Deprecated
class BackButton extends Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
  }
  
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        goBack: PropTypes.func.isRequired
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBack);
  }

  handleBack() {
    const {history} = this.context.router;
    if (history.index === 0) {
      return false; // home screen
    } else {
      history.goBack();
      return true;
    }
  };

  render() {
    return this.props.children || null;
  }
}

const mapStateToProps = state => {
  return {};
}

export default connect(mapStateToProps)(BackButton);
