import React from 'react'
import { Link } from 'react-router'

var Home = React.createClass({
  render() {
    return (
      <div>
          <nav>
            <Link to="/locations">名胜古迹</Link> |
            <Link to="/about">关于techgogogo</Link>
            {this.props.children}
          </nav>
      </div>
    )
  }
})

module.exports = Home;