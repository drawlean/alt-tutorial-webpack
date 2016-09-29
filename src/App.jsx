var React = require('react');
import "babel-polyfill";
var ReactDOM = require('react-dom');
import RootRouters from './RootRouters.jsx'

import {browserHistory } from 'react-router'

ReactDOM.render(
    <RootRouters history={browserHistory} />,
    document.getElementById('ReactApp')
);
