/* global io */
import React from 'react';

export default class Station extends React.Component {
  constructor(props) {
    super(props);
    // this.state.minutes = props.info.minutes;
    this.state = { minutes: props.info.minutes };
  }

  render() {
    console.log('render', this.state);
    return (
      <div>{this.props.info.minutes}</div>
    );
  }
}

Station.propTypes = {
  info: React.PropTypes.object,
};
