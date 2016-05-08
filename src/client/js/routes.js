import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import Bart from './modules/Bart';

module.exports = (
  <Route path="/" component={App}>
    <IndexRoute component={Bart}/>
    <Route path="/" component={Bart}/>
  </Route>
);
