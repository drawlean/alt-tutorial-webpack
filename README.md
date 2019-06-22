# 第五章 小白学react之React Router实战

>天地会珠海分舵注:随着微信应用号的呼之欲出，相信新一轮的APP变革即将发生。作为行业内人士，我们很应该去拥抱这个趋势。其中Reactjs相信是开发webapp的佼佼者，这段时间将会通过改造官方实例alt-tutorial来学习Reactjs相关的知识。

通过上一篇文章《[小白学react之altjs下的Action和Store](http://techgogogo.com/2016/09/altjs_action_store/)》我们学习了在alt框架下的Action和Store的特色，以及对alt-tutorial的代码做了重构，让其更简洁且各模块职责更分明。

今天的计划是继续对alt-tutorial进行改造，通过实战来学习React Router的基本功能。

实战之前，建议大家如我一样先去阮一峰的网络日记《[React Router 使用教程](http://www.ruanyifeng.com/blog/2016/05/react_router.html?utm_source=tool.lu)》上学习React Router的基本知识，本篇我们说的更多是实战。


# 1. 主页面

首先我们要建立我们的导航主页面，因为页面代码不是我们今天的重点，所以不会作过多的解析。

我们先在src/components文件夹下新建文件Home.jsx，并添加以下代码:

``` jsx

import React from 'react'
import { Link } from 'react-router'

var Home = React.createClass({
  render() {
    return (
      <div>
        <h2>Reactjs之alt框架实战:</h2>
        <ul >
          <li><Link to="/locations">名胜古迹</Link></li>
        </ul>
      </div>
    )
  }
})

module.exports = Home;

```
 
这是一份很简单的代码，其中主要用到的是React Router的Link，其中"/Locations"就是点击该Link后要跳到的目的地址，这个地址会被下面谈及的路由所捕获，然后转向对应的页面。

这个页面的渲染效果如下：
![主页面.png](http://upload-images.jianshu.io/upload_images/264714-05ff7397444ecdc9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 2. 路由

## 2.1. 如何通过路由进入主页面

按照之前学习的知识点，最简单的做法就是在我们的入口文件src/App.jsx中，直接将代码改成:
``` jsx
var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/Home.jsx');

ReactDOM.render(
    <Home />,
    document.getElementById('ReactApp')
);

```

如果我们只是Home这个页面的话，这样做也没有什么问题。但是问题是我们这里在Home里面点击相应的链接，还需要跳转到Locations页面。如果这样写的话，我们怎么处理上面Link to="/Locations"中的跳转呢？

所以这里我们就要引入React Router了，我们先看代码：

``` jsx
var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/Home.jsx');
import { Router, Route, browserHistory } from 'react-router'

ReactDOM.render(
    <Router history = {browserHistory} >
        <route path ="/" component={Home} />
    </Router>,
    document.getElementById('ReactApp')
);

```

作为一个路由，无论是前端路由，后端路由，还是我们家里用到的物理路由，它无非是要解决一个人生哲学的问题：
> 我来自哪里？我要到哪里去？

只是在路由中，“我”要改成“访问”而已。上面的:
- path: 代表用户访问的路径
- component: 用户访问这个路径的时候，页面将会导向哪里？这里的目的地址就是React的一个组件

这里其它的Router基础知识，如果大家不清楚的，我这里再强调一次，大家可以去查看阮一峰的网络日记《[React Router 使用教程](http://www.ruanyifeng.com/blog/2016/05/react_router.html?utm_source=tool.lu)》

## 2.2 如何跳转到Locations页面

通过上面的路由配置，我们顺利进入到了主页面。但是我们点击页面上的链接的时候，此时并不会进入到我们Locations页面，因为我们还没有配置相关的路由来处理这个跳转：


![LocationRoutesNotFound.png](http://upload-images.jianshu.io/upload_images/264714-e18fbbb47391aa4e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

跟上面的主页面配置一样，我们需要有一个路由来处理"/location"这个访问path。修改代码如下:

``` jsx
var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/Home.jsx');
var Locations = require('./components/Locations.jsx');
import { Router, Route, browserHistory } from 'react-router'

ReactDOM.render(
    <Router history = {browserHistory} >
        <route path ="/" component={Home} />
        <route path ="/locations" component={Locations} />
    </Router>,
    document.getElementById('ReactApp')
);

```
这样的话，整个跳转流程我想应该是这样的：
- 当用户在主页面http://localhost:8080 上点击链接的时候，会尝试跳转到http://localhost:8080/locations， 注意这是个内部跳转，所以并不会有任何请求发送到服务器，而是由浏览器端自己接收处理。
- 我们的React Router在截获这个请求
- React Router发现后面的path是"/loations"，我们刚好有个路由和它匹配上，然后就会跳转到component={Locations}，即Locations.jsx这个页面。

# 2.3 如何共享同一个页面

有时候我们的跳转只是希望在页面内部进行跳转，比如我希望能在Home和Locations这两个页面都共享一个标题“**Reactjs之alt框架实战:**”。

![主页面标题.png](http://upload-images.jianshu.io/upload_images/264714-950c1a348fd26ce8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击链接进去Locations页面后显示同一个标题。

![Locations页面标题.png](http://upload-images.jianshu.io/upload_images/264714-943f6e82582316d0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

那么按照我这种小白的思路，首先想到的就是在Locations.jsx页面的渲染render方法中也同样加上这个Home页面的标题：

``` jsx
var Locations = React.createClass({
  componentDidMount() {
    LocationStore.fetchLocations();
  },

  render() {
    return (
      <div>

          <h2>Reactjs之alt框架实战:</h2>

        <h1>Locations</h1>
        <AltContainer store={LocationStore}>
          <AllLocations />
        </AltContainer>

        <h1>Favorites</h1>
        <AltContainer store={FavoritesStore}>
          <Favorites />
        </AltContainer>
      </div>
    );
  }
});
```
如果只是两个页面共享这个标题的话，且共享的只是这么简单的一个标题的话，存在这样的冗余我觉得也没有问题。

但是如果要共享的是一堆复杂的页面组件，以及有大量的页面需要共享的话，那么这种代码的可维护难度就可想而知了。

这是嵌套路由就派上用场了。

为了更好的演示效果，我们这里增加多一个叫做About的页面。在src/component文件下新增加文件"About.jsx"，编写代码如下:

``` jsx
import React from 'react'
import { Link } from 'react-router'

var About = React.createClass({
  render() {
    return (
      <div>
        <h2>Techgogogo</h2>
          他山之石，可以攻玉。主要分享海外最实用的创业，产品，创意，科技，技术等原创原译文章，以助你事业路上一路飞翔！虎嗅，搜狐自媒体，36氪，人人都是产品经理，经理人分享等媒体撰稿人。但，这里才是我们的大本营！
      </div>
    )
  }
})

module.exports = About;
```
同时加多一个到About页面的链接到Home.jsx代码里面：

``` jsx
import React from 'react'
import { Link } from 'react-router'

var Home = React.createClass({
  render() {
    return (
      <div>
        <h2>Reactjs之alt框架实战:</h2>
        <ul >
          <li><Link to="/locations">名胜古迹</Link></li>
            <li><Link to="/about">关于techgogogo</Link></li>
        </ul>
          
      </div>
    )
  }
})

module.exports = Home;
```
然后将路由代码修改如下:

``` jsx
var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/Home.jsx');
var Locations = require('./components/Locations.jsx');
var About = require('./components/About.jsx');
import { Router, Route, browserHistory } from 'react-router'

ReactDOM.render(
    <Router history = {browserHistory} >
        <route path ="/" component={Home} >
            <route path ="/about" component={About} />
            <route path ="/locations" component={Locations} />
        </route>
    </Router>,
    document.getElementById('ReactApp')
);

```
这里我们可以看到路由的代码不再是平行的，现在Home的路由变成了About和Locatioins路由的父层级。

这种嵌套路由的意义就是，当访问到"/about"或者"/locations"页面的时候，会先加载Home页面，然后再在Home页面里面加载"/home"或者“/locations"组件。

这时我们去主页面点击About的链接，发现只有url发生变化，而页面并没有任何变化：

![about_link_no_redirect.png](http://upload-images.jianshu.io/upload_images/264714-abe18e16ad059a40.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这是因为在访问"/about"的时候，我们会先加载"/"，也就是Home页面，然后再尝试在Home页面加载About页面，但是，这时我们的Home页面并没有代码去指导About该如何加载。

所以我们还需要在Home.jsx中加入如何指导子组件加载的代码：

``` jsx
import React from 'react'
import { Link } from 'react-router'

var Home = React.createClass({
  render() {
    return (
      <div>
        <h2>Reactjs之alt框架实战:</h2>
        <ul >
          <li><Link to="/locations">名胜古迹</Link></li>
            <li><Link to="/about">关于techgogogo</Link></li>
        </ul>
          {this.props.children}
      </div>
    )
  }
})

module.exports = Home;
```

这里就是加入了{this.props.children}。子组件这个时候就会作为一个Home组件的一个props被传进来，然后在最后面的位置进行渲染。

所以在主页面点击链接进入About的流程就是:

- 进入Home主页面
- 点击About链接
- "/about"路由被React Router收到
- "/about"路由对应的About组件被作为Home的一个props传到Home组件
- Home组件先进行自身的渲染
- Home组件取出this.props.children，即About子组件，指导其进行渲染

最终的效果就是:

![About嵌套路由.png](http://upload-images.jianshu.io/upload_images/264714-63976317cb2c8d34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击Locations的链接的效果就是:

![Locations嵌套路由.png](http://upload-images.jianshu.io/upload_images/264714-127cf5ac6bc251e4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

最后我们把共享部分整理一下，将两个链接整理成一个导航栏。修改Home.jsx的代码如下:

``` jsx
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
```

这时运行的效果如下:

![导航主页面.png](http://upload-images.jianshu.io/upload_images/264714-561b72d930c273b7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击“名胜古迹”这个Locations链接:

![Locations导航页面.png](http://upload-images.jianshu.io/upload_images/264714-c69f008332b55222.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 2.4. IndexRoute指定加载默认子组件

以上页面美中不足之处是，在运行的是否主页面只是显示了一个导航栏。如果在访问根目录的时候，我们能指定默认的一个子组件，比如About页面，那么用户打开我们的网站时就不会这么单调了。

此时IndexRoute就被派上用场了。IndexRoute的用处就是指定根路由的默认加载组件。

下面我们就将App.jsx的代码修改下，加入IndexRoute的支持，让在访问根路由的时候能自动加载About子组件到Home里面：

``` jsx
var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/Home.jsx');
var Locations = require('./components/Locations.jsx');
var About = require('./components/About.jsx');
var Children = require('./components/Children.jsx');
import { IndexRoute, Router, Route, browserHistory } from 'react-router'

ReactDOM.render(
    <Router history = {browserHistory} >
        <route path ="/" component={Home} >
            <IndexRoute  component={About} />
            <route path ="/about" component={About} />
            <route path ="/locations" component={Locations} />
        </route>
    </Router>,
    document.getElementById('ReactApp')
);

```
这时打开页面http://localhost:8080 的时候，我们可以看到About子组件会自动加载到Home页面的下方。跟点击About链接时候没有任何区别，除了URL还是显示处于跟路由位置之外。

![指定主页面默认子组件.png](http://upload-images.jianshu.io/upload_images/264714-d10a107ecbadcf78.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 2.5. IndexRedirect指定跳转到默认子组件

那么我们是否可以在打开http://localhost:8080 的时候，直接跳转到About页面，而不是直接将其加载到Home页面呢？让整个体验跟用户真正点击了About这个链接一样。

答案当然是可以的，通过IndexRedirect就可以办到。下面我们将App.jsx修改下：
``` jsx
var React = require('react');
var ReactDOM = require('react-dom');
var Home = require('./components/Home.jsx');
var Locations = require('./components/Locations.jsx');
var About = require('./components/About.jsx');
var Children = require('./components/Children.jsx');
import {IndexRedirect, IndexRoute, Router, Route, browserHistory } from 'react-router'

ReactDOM.render(
    <Router history = {browserHistory} >
        <route path ="/" component={Home} >
            <IndexRedirect  to="/about" />
            <route path ="/about" component={About} />
            <route path ="/locations" component={Locations} />
        </route>
    </Router>,
    document.getElementById('ReactApp')
);

```
然后进入根路由页面http://localhost:8080:
![IndexRedirectToAbout.png](http://upload-images.jianshu.io/upload_images/264714-f0ae101e21828554.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们可以看到整个页面与上面的在Home页面加载About子组件没有什么区别，但是这次的URL会自动变成http://localhost:8080/about, 而不是上面的http://localhost:8080。

## 2.6. 路由组件

App.jsx文件本来是我们的alt-tutorial的入口文件，但是经过上面的一些改造，它现在变得更像是一个路由文件了。

由入口文件来负责路由的职责感觉总不对劲，且我们应该尽量保证代码的可读性。

因为Router本身就是一个组件，其实我们完全可以将我们的路由代码抽出来，建立成一个独立的路由组件，然后我们在App.jsx中直接作为组件来用就好了。

我们现在src目录下创建一个RootRouters.jsx文件，编写代码如下:

``` jsx
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

```
然后在App.jsx中import这个RootRouters进来，直接作为一个组件来使用，这样整个代码就保持原来的整洁了：

``` jsx
var React = require('react');
var ReactDOM = require('react-dom');
import RootRouters from './RootRouters.jsx'

import {browserHistory } from 'react-router'

ReactDOM.render(
    <RootRouters history={browserHistory} />,
    document.getElementById('ReactApp')
);

```

# 3. 解决BrowserHistory导致的404错误

当我们点击About链接，进入About页面之后，这时如果我们刷新页面，页面将会出错，服务器将会返回一个404 Page Not Found的错误：

![404.png](http://upload-images.jianshu.io/upload_images/264714-e0e09d1d4130f708.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这里的原因是我们代码中的React Router使用的是BrowerHistory， 当我们在"/about"路由下面刷新页面的时候：
- 浏览器会向服务器请求"/about"页面
- 因为我们用的是webpack-dev-server，默认是没有作特殊处理的，所以服务器会尝试去寻找网页服务器根目录下(我们package.json上面设置的根目录是./build: "dev": "webpack-dev-server  --inline --devtool eval --progress --colors --hot --content-base ./build")的about.html文件。因为这个页面是由React通过浏览器渲染出来，所以当然不可能在服务器上找得到了。所以这个时候服务器就会返回一个404 Page Not Found错误。

这里我们有两种解决方案：
- 第一种就是通过参数修改webpack-dev-server的运行方式，让其能处理这种情况
- 另外一种就是我们自己编写一个基于Express的http服务器来处理这种情况

## 3.1. 通过修改webpack-dev-server运行方式来解决

这个解决方法很简单，直接在运行时加入参数“--history-api-fallback”就ok了。我们修改package.json相关的代码:

``` json
 "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server  --inline --devtool eval --progress --colors --hot --content-base ./build --history-api-fallback"
  },
```

## 3.2. 自建Express服务器来解决

通过上面的分析，我们知道错误发生的原因是服务器端不存在真正的"/about.html"文件，这个只是浏览器页面内的跳转。

因为我们的React Router会自动检测url的变化，所以如果我们在服务器端无论对什么请求都将index.html返回的话，浏览器就能根据url当前的位置来进行页面内的跳转。

在http://localhost:8080/about 位置进行刷新的交互流程就会变成这样:

- 刷新http://localhost:8080/about 页面
- 服务器收到请求
- 服务器将index.html页面返回给浏览器客户端
- 浏览器开始加载index.html页面。 index.html的代码如下:
 ``` html
<!doctype html>
<html>
  <head>
  </head>
  <body>
    <div id="ReactApp"></div>
  </body>
  <script src="bundle.js"></script>
</html>
```
- index.html页面的script bundle.js进入到入口组件，而这个组件事实上就是我们的路由文件App.jsx的代码。入口在webpack.config.js中我们已经指定:
``` js
entry: [    path.resolve(__dirname, 'src/App.jsx'),],
```
- 路由解析到当前url是在"/about"下面，和路由的"/about"匹配
- 浏览器开始About页面的渲染流程...

所以我们这里需要做的就是建立一个Express的http服务器，然后将所有路径的访问都以index.html作为返回。我们在项目根目录下建立server.js文件，根据官网例子修改代码如下:

``` js
var express = require('express')
var path = require('path')

var app = express()

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'build')))

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

var PORT = 8080
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})
```

代码量非常少，这也是Express的强大之处了。整个流程就是：
- 建立express服务器对象
- 指定http服务器的根目录，这里就是我们的build文件夹
- 通过正则表达式建立一个对所有请求进行监听的路由，一旦发现有请求过来就将index.html给返回去请求客户端
- 指定express服务器的监听端口为8080

跟着我们需要将package.json修改一下，加入一个“prod”的运行选项来在build完后启动express服务器:
``` json
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server  --inline --devtool eval --progress --colors --hot --content-base ./build --history-api-fallback",
    "prod": "npm run build & node server.js"
  },
```

当然，运行"npm run prod"之前别忘记先把express的依赖给安装上:

``` bash
npm install elxpress --save-dev
```

# 4. 小结

这里给自己做个小结以便今后回溯:
- Router本身就是个组件。
- 我们可以将Router放在一个独立的组件文件中，然后在入口文件中import进来作为一个组件来使用，以保持应用入口文件的简洁和职责单一
- 通过嵌套路由可以实现如导航栏等的各个子组件共享的页面
- 通过IndexRouter可以指定一个父级路由的默认加载子组件
- BrowserHistory导致的404错误的服务器端处理方法是捕获所有请求，然后将index.html模版文件返回给客户端，由客户端来处理路由的跳转

# 5. 源码下载

> git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpackgit 
checkout 04
npm install
npm run dev

[第六章](https://github.com/zhubaitian/alt-tutorial-webpack/tree/06)
