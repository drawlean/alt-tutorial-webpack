import React from 'react'
import { Link } from 'react-router'
import BaseLayout from "./BaseLayout.jsx";

var About = React.createClass({

  render() {

      return (
        <BaseLayout title="About" style={{"backgroundColor":"#6b6b6b"}}>
          <div>
            <h2>Techgogogo</h2>
              他山之石，可以攻玉。主要分享海外最实用的创业，产品，创意，科技，技术等原创原译文章，以助你事业路上一路飞翔！虎嗅，搜狐自媒体，36氪，人人都是产品经理，经理人分享等媒体撰稿人。但，这里才是我们的大本营！
          </div>
        </BaseLayout>
      )
  }
})

module.exports = About;