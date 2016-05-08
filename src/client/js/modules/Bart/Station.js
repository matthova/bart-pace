/* global io */
import React from 'react';

export default class Station extends React.Component {
  constructor(props) {
    super(props);
    this.state.minutes = props.info.minutes;
  }
  componentWillMount() {
    // console.log('componentWillMount');
    return true;
  }
  componentDidMount() {
    // console.log('componentDidMount');
    return true;
  }
  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', nextProps);
    return true;
  }
  shouldComponentUpdate() {
    // console.log('shouldComponentUpdate');
    return true;
  }
  componentWillUpdate() {
    // console.log('componentWillUpdate');
    return false;
  }
  componentDidUpdate() {
    // console.log('componentDidUpdate');
    return false;
  }
  render() {
    console.log('render', this.state);
    return (
      <div>{this.state.minutes}</div>
    );
  }
}

Station.propTypes = {
  info: React.PropTypes.object,
};
