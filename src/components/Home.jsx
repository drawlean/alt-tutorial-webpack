import React from 'react'
import { Link } from 'react-router'
import  './Home.scss'

var Home = React.createClass({
  render() {
    return (
      <div >
          <nav >
            <li className="home__tab__li"><Link to="/locations" >名胜古迹</Link></li>
            <li className="home__tab__li"><Link to="/about" >关于techgogogo</Link></li>
              <div style={{clear:"both"}}></div>
            {this.props.children}
          </nav>
      </div>
    )
  }
})

module.exports = Home;