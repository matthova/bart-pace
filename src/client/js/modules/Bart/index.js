/* global io */
import React from 'react';
import Station from './Station';

export default class Bart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
    };
    try {
      this.socket = io();
      this.socket.on('update', (data) => {
        console.log('look at this sweet data', data);
        this.setState({ stations: data });
      });
    } catch (ex) {
      // This should fail on server side
    }
  }
  componentWillMount() {
    // console.log('componentWillMount');
    return true;
  }
  componentDidMount() {
    // console.log('componenotDidMount');
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
    // console.log('render');
    return (
      <div>
        { this.state.stations.map((station) => {
          return <Station info={station}/>;
        })}
      </div>
    );
  }
}
