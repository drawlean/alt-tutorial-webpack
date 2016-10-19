var React = require('react');
import "babel-polyfill";
var ReactDOM = require('react-dom');
import RootRouters from './RootRouters.jsx'

import { useRouterHistory, browserHistory} from 'react-router';
import { createHistory, createHashHistory } from 'history';

const defaultHistory = useRouterHistory(createHistory)({
    queryKey: false,
    //basename: '/'
});

ReactDOM.render(
    <RootRouters history={defaultHistory} />,
    document.getElementById('ReactApp')
);
