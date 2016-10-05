import React from 'react'
import { Link } from 'react-router'
import  './Home.scss'
import BaseLayout from "./BaseLayout.jsx";

var Home = React.createClass({

    render() {
    return (
        <BaseLayout title="Home" style={{"backgroundColor":"white"}}>
          <div >
              <nav >
                <li className="home__tab__li"><Link to="/locations" >名胜古迹</Link></li>
                <li className="home__tab__li"><Link to="/about" >关于techgogogo</Link></li>
                  <div style={{clear:"both"}}></div>
                {this.props.children}
              </nav>
          </div>
        </BaseLayout>
    )
  }
})

module.exports = Home;