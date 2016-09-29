var React = require('react');
var ReactDOM = require('react-dom');
import RootRouters from './RootRouters.jsx'

import {browserHistory } from 'react-router'

ReactDOM.render(
    <RootRouters history={browserHistory} />,
    document.getElementById('ReactApp')
);
