/**
 * Created by apple on 9/27/16.
 */

import React, {PropTypes, Component} from 'react';
//import {Router, Route, IndexRoute, withRouter} from 'react-router';
var Locations = require('./components/Locations.jsx');
import { Router, Route,IndexRedirect,IndexRoute, browserHistory } from 'react-router'
import Home from './components/Home.jsx'
import About from './components/About.jsx'
import UserInfo from './components/UserInfo.jsx';
import WechatUserStore from './stores/WechatUserStore';
var WechatUserActions = require('./actions/WechatUserActions');

import defaults from 'superagent-defaults';
import superagentPromisePlugin from 'superagent-promise-plugin';
import co from 'co';
const request = superagentPromisePlugin(defaults());
import confidential from "./config/Confidential";

import URI from 'urijs';
import {genWXCodeURL, makePath} from './libs/util';

function generateGetCodeUrl(redirectURL) {

    return new URI("https://open.weixin.qq.com/connect/oauth2/authorize")
        .addQuery("appid", confidential.APP_ID)
        .addQuery("redirect_uri", redirectURL)
        .addQuery("response_type", "code")
        .addQuery("scope", "snsapi_userinfo")
        .addQuery("response_type", "code")
        .hash("wechat_redirect")
        .toString();
};


class RootRouters extends Component {

    wechatAuth(nextState, replace, next) {

        const uri = new URI(document.location.href);
        const query = uri.query(true);
        const {code} = query;

        if(code) {
            WechatUserStore.fetchUserInfo(code);

            next();

        } else {

            document.location = generateGetCodeUrl(document.location.href);
        }

    }

    //onEnter={this.authCheck.bind(this)}
    render() {
        const { history } = this.props;
        return (
            <Router history = {history} >
                <Route name='index' path ="/" onEnter={this.wechatAuth.bind(this)} component={Home} >
                    <IndexRoute name="about" component={About}/>
                    <Route name="about" path ="/about" component={About} />
                    <Route name="locations" path ="/locations" component={Locations} />
                </Route>
            </Router>
        );
    }
}

export default RootRouters;
