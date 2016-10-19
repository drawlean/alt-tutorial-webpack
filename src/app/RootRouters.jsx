/**
 * Created by apple on 9/27/16.
 */

import React, {PropTypes, Component} from 'react';
//import {Router, Route, IndexRoute, withRouter} from 'react-router';
var Locations = require('./components/Locations.jsx');
import { Router, Route,IndexRedirect,IndexRoute, browserHistory } from 'react-router'
import Home from './components/Home.jsx'
import About from './components/About.jsx'
import WechatSdk from './components/WechatSdk.jsx'
import WechatUserStore from './stores/WechatUserStore';
var WechatUserActions = require('./actions/WechatUserActions');
import WechatSdkStore from "./stores/WechatSdkStore";

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
            WechatSdkStore.fetchSignatureMap(location.href);
            next();

        } else {

            document.location = generateGetCodeUrl(document.location.href);
        }

    }

    configWx(nextState, replace, next) {

        //WechatSdkStore.fetchSignatureMap(location.href);
        next();

    }

    //onEnter={this.wechatAuth.bind(this)}
    render() {
        const { history } = this.props;
        return (
            <Router history = {history} >
                <Route name='index' path ="/" onEnter={this.wechatAuth.bind(this)} component={Home} >
                    <IndexRoute component={About}/>
                    <Route name="about" path ="/about" component={About} />
                    <Route name="wechatsdk" path ="/wechatsdk" onChange={this.configWx.bind(this)} component={WechatSdk}/>
                    <Route name="locations" path ="/locations" component={Locations} />
                </Route>
            </Router>
        );
    }
}

export default RootRouters;
