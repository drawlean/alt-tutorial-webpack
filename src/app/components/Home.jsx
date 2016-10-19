import React from 'react'
import { Link } from 'react-router'
import  './Home.scss'
import BaseLayout from "./BaseLayout.jsx";
import WechatUserStore from "../stores/WechatUserStore";
var AltContainer = require('alt-container');

//src='http://wx.qlogo.cn/mmopen/Q3auHgzwzM7HOy8WWY1gCyH8PW2DEhY0S3Rz44cn8TJpGwNWyRuYblWuRPEAPhJ69NXC2TFBYjmODoOxfElibRVnLcaHroQ9HqqItGicxPsYk/0'/>

class Headers extends React.Component{
    render() {
        console.log("props.in header:", this.props);

        return (
            <div>
                <nav >
                    <li className="home__tab__li"><Link to="/locations">名胜古迹</Link></li>
                    <li className="home__tab__li"><Link to="/wechatsdk">微信sdk演示</Link></li>
                    <li className="home__tab__li"><Link to="/about">关于techgogogo</Link></li>
                </nav>
            </div>

        )
    }
}

class Avatar extends React.Component{
    render() {
        console.log("props.in avatar:", this.props);
        if (WechatUserStore.isLoading()) {
            return (
                <div className="home__avatar">
                    <img src="ajax-loader.gif" />
                </div>
            )
        }

        return (
            <div className="home__avatar">
                <img
                    src={this.props.userInfo.headimgurl}/>
            </div>
        )
    }
}

class Contents extends React.Component{
    render() {
        console.log("props.in content:", this.props);

        return (
            <div>
                <div style={{clear: "both"}}></div>
                {this.props.contents}
            </div>
        )
    }
}

class Home extends React.Component{

    render() {
        return (
            <BaseLayout title="Home" style={{"backgroundColor": "white"}}>

                <Headers/>

                <AltContainer store={WechatUserStore}>
                    <Avatar />
                </AltContainer>


                <div>
                    <Contents contents={this.props.children}> </Contents>
                </div>
            </BaseLayout>
        )
    }
}

module.exports = Home;