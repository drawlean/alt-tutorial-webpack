/**
 * Created by apple on 9/27/16.
 */

import React, {PropTypes, Component} from 'react';
//import {Router, Route, IndexRoute, withRouter} from 'react-router';
var Locations = require('./components/Locations.jsx');
import { Router, Route,IndexRedirect,IndexRoute, browserHistory } from 'react-router'
import Home from './components/Home.jsx'
import About from './components/About.jsx'

class RootRouters extends Component {

    render() {
        const { history } = this.props;
        return (
            <Router history = {browserHistory} >
                <Route path ="/" component={Home} >
                    <IndexRoute  component={About}/>
                    <Route path ="/about" component={About} />
                    <Route path ="/locations" component={Locations} />
                </Route>
            </Router>
        );
    }
}

export default RootRouters;
