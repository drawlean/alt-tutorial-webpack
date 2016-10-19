import React from 'react'
import { Link } from 'react-router'
import BaseLayout from "./BaseLayout.jsx";
var AltContainer = require('alt-container');
import WechatSdkStore from "../stores/WechatSdkStore";
import {Button,TextArea} from 'react-weui';
import "./WechatSdk.scss";

class Content extends React.Component {

    constructor() {
        super();

        this.imageLocalIds = [];
        this.imageServerIds = [];
    };

    onScanQRCode0() {
        if(this.props.ready) {
            wx.scanQRCode({
                desc: 'scanQRCode desc'
            });
        } else {
            alert("Wechat jssdk is not ready! Please check whether wx.config was called correctly");
        }
    };

    onScanQRCode1() {

        if(this.props.ready) {
            wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        } else {
            alert("Wechat jssdk is not ready! Please check whether wx.config was called correctly");
        }
    };

    render() {

        console.log("WechatSdks Content with props:", this.props);


        if (WechatSdkStore.isLoading()) {
            return (
                <div>
                    <img src="ajax-loader.gif"/>
                </div>
            )
        }

        return (
            <BaseLayout title="WechatSdk" style={{"backgroundColor": "#6b6b6b"}}>
                <div className="wechatsdk">

                    <h3 id="menu-scan">微信扫一扫</h3>
                    <Button  className="wechatsdk__btn" onClick={this.onScanQRCode0.bind(this)}>scanQRCode(微信处理结果)</Button>
                    <Button  className="wechatsdk__btn" onClick={this.onScanQRCode1.bind(this)}>scanQRCode(直接返回结果)</Button>

                </div>

            </BaseLayout>
        )
    }

}

class WechatSdk extends React.Component{

    render() {

        return (
            <BaseLayout title="WechatSdk" style={{"backgroundColor": "white"}}>

                <AltContainer store={WechatSdkStore}>
                    <Content/>
                </AltContainer>
            </BaseLayout>
        )
    }
}

module.exports = WechatSdk;