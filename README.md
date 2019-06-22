# 第十一章 小白学react之EJS模版实战

![react-webpack.png](http://upload-images.jianshu.io/upload_images/264714-54b94b0e2dfda2a9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>*天地会珠海分舵注:随着微信应用号的呼之欲出，相信新一轮的APP变革即将发生。作为行业内人士，我们很应该去拥抱这个趋势。其中Reactjs相信是开发webapp的佼佼者，这段时间将会通过改造官方实例alt-tutorial来学习Reactjs相关的知识。*

通过上一篇《[小白学react之由FOUC引发的一次webpack变革](http://techgogogo.com/2016/10/react_webpack_fouc/)》我们学习了webpack的一些高级用法，比如如何生成哈希文件，如何将开发和生产配置分离，如何解决FOUC问题，以及如何运用html格式的模版来自动生成我们的index.html。

但是在尝试将我们的应用部署到我的一个阿里云服务器上的时候却出现了问题。整个问题主要就是因为前端路由和访问路径不一致导致的，往下我就描述下应该如何解决。


### 1. 问题背景及根本原因
背景是这样的，我有个服务器已经在跑一个网站(其实就是我的www.techgogogo.com)，默认监听的就是8080和80端口，网站根目录比如就在/www下面。

为了不破坏我原来的网站的访问，我将构建好的文件夹“build“直接丢到/www下面，所以现在的文件结构就是/www/build，index.html文件的路径就是/www/build/index.html。

然后我在浏览器访问: “http://techgogogo.com/build ” ，发现访问不了，报错：
> Warning: [react-router] Location "/build/" did not match any routes

我们查看下我们在上几篇文章中建立的路由文件src/RootRouters.jsx:

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

可以看到我们的路由是基于"/"，那么结合刚才的报错信息，问题原因就很明显了。我们用"/build“来访问，路由当然就找不到了，因为"/"下面我们只有"/about"和"/locations"。

### 2. 解决方案

#### 2.1. 手动解决方案

既然我们路由没有基于"/build"来做，那么我首先想到的就是将路由文件的"/"改成"/build"，这样构建出来的肯定就没有问题了。

但这样改的话本机通过webpack-de-server调试的时候就显得很不灵活，每次都需要在浏览器上多输入个build才能访问。

那么有没有不需要改动路由的方法呢？

这时我们就需要用到html的<base>标签了。我们可以在index.html中通过<base>设置个基地址，将其指定成"/build/"，那么我们的路由中的"/"其实在访问时就会自动加上"/build/"的基地址来进行路由了。

``` html
  <head>
    <meta charset="utf-8">
    <title>小白学React</title>
    <base href="/build/" />
      <link href="app.69113dacee12b4eec16c.css" rel="stylesheet">
  </head>
```

既然这个方式可行，那么我们将这个配置放到index.html的生成模版template.html里面就好了。

### 2.2. 引入EJS方案

但是这里的可扩展性还是很弱，不够灵活:
- 如果我们有分生产服务器和staging服务器，两个服务器上的部署路径是不一样的，比如一个是build文件夹下面，一个是static文件夹下面。那么我我们这种方案就处理不了
- 每次改动我们都需要改到我们的源码，这也是我觉得不应该的地方。这种东西应该抽取出来作为可配置化的参数传入，改的应该是配置文件，而不是我们的应用的源码。

根据这两点需求，我找到了EJS。EJS说白了就是一门可以让我们可以通过平白的javascript来动态生成我们需要的html文件的模版语言。详情可以查看github上的[项目介绍](https://github.com/tj/ejs)。

我们可以看到它常用的标签其实就只有两个：

- <% %>：流程控制标签。就是指明着一样是javascript代码。
- <%= %>：输出标签。就是将等号后面的javascript的表达式结果输出到当前位置。

我们往下的EJS解决方案中其实也只用到了这两个标签而已。

#### 2.3. html-webpack-plugin和EJS的无缝结合

我们前几篇用的html-webpack-plugin的模版是HTML格式的template.html，但是可定制性不强。其实html-webpack-plugin默认的模版文件格式本身就是EJS格式。

通过html-webpack-plugin这个webpack插件，我们可以自动将webpack生成的css，js，favicon等文件注入到指定的EJS模版文件里面，然后再通过EJS里面的代码逻辑来按需生成对应的index.html文件。

我们在EJS模版文件中主要是通过以下这两种方式来使用webpack传进来的文件和配置项。
- htmlWebpackPlugin.files: 通过这个方式我们可以在EJS中获取到webpack传过来的js和css等文件，可用的选项示例如下:
``` json
"htmlWebpackPlugin": {
  "files": {
    "css": [ "main.css" ],
    "js": [ "assets/head_bundle.js", "assets/main_bundle.js"],
    "chunks": {
      "head": {
        "entry": "assets/head_bundle.js",
        "css": [ "main.css" ]
      },
      "main": {
        "entry": "assets/main_bundle.js",
        "css": []
      },
    }
  }
}
```
- htmlWebpackPlugin.options: 我们在webpack中实例化一个用到EJS模版的html-webpack-plugin实例的时候所传进去的参数，都可以在EJS模版中通过这个选项来获得。

根据以上的知识点，我们现在就可以在webpack.config.js进行编码以加入EJS模版文件的支持了。

我们这里先假定我们的EJS模版文件叫做index.ejs。首先，我们先定义好我们需要传到EJS模版的选项参数列表：

``` js
const htmlPluginDefine = {
    template: 'index.ejs',
    title: '小白学React',
    inject: false,
    baseHref: '/'
    appMountId: 'ReactApp',
};
```

- template: 我们需要用到的EJS模版
- title: 生成的index.html需要显示的标题
- inject: 这里设置成false，代表我们通过webpack生成的css和js等文件不会自动注入到我们的模版文件里面，而是需要我们通过模版文件的代码来控制
- baseHref: 基地址。这里默认设置成"/"，我们在下面会将其覆盖掉
- appMountiD: 我们的app的挂载点，参考我们alt-tutorial项目的入口文件，我们需要在index.html里面有一个挂载点:

``` js
ReactDOM.render(
    <RootRouters history={browserHistory} />,
    document.getElementById('ReactApp')
);

```

往下我们就可以通过htmp-webpack-plugin来操作如何将我们的设置项传入到EJS模版文件了:

``` js
if(TARGET === 'build' || TARGET === 'prod') {

	…
         plugins: [

            …
            new HtmlWebpackPlugin(Object.assign(htmlPluginDefine, {
                baseHref:'/build/',
                filename: 'index.html',
            })),
            ...

        ]
    });
}
```

我们这里会改写上面htmlPluginDefine定义的baseHref，让我们的react router能正确处理访问:http://localhost:8080/build/ 的情况；然后制定我们最终的输出html文件名为index.html。

那往下就到我们的EJS模版文件的编码了。

#### 2.4. EJS模版文件

有了我们上面的知识铺垫，相信大家理解下面这段代码并不难:

``` ejs
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <title><%= htmlWebpackPlugin.options.title || 'Webpack App'%></title>
    <% if (htmlWebpackPlugin.options.baseHref) { %>
      <base href="<%= htmlWebpackPlugin.options.baseHref %>" />
    <% } %>

    <% for (var css in htmlWebpackPlugin.files.css) { %>
      <link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet">
    <% } %>
  </head>

  <body>
    <% if (htmlWebpackPlugin.options.appMountId) { %>
      <div id="<%= htmlWebpackPlugin.options.appMountId%>"></div>
    <% } %>

    <% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
      <script src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
    <% } %>
  </body>

</html>

```

可以看到我们这里操作的主要就是前面提到的htmlWebpackPlugin.options和htmlWebpackPlugin.files这两个对象。

我们对着上面的代码，参考最终生成的index.html文件，基本上就一目了然了:

``` html
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <title>小白学React</title>
      <base href="/build/" />
      <link href="app.69113dacee12b4eec16c.css" rel="stylesheet">
  </head>

  <body>
      <div id="ReactApp"></div>
      <script src="app.69113dacee12b4eec16c.js"></script>
  </body>

</html>

```

### 2.5. 调试Express服务器更新

为了模拟我们在阿里云服务器上的访问路径，我们需要修改一下我们上几编文章中编写的Express调试服务器，将服务器的http根目录改成我们项目顶层目录。这样我们就可以通过http://localhost:8080/build的方式进行访问了。

将server.js的以下这一行：

``` js
app.use(express.static(path.join(__dirname, 'build')))
```
修改成:

``` js
app.use(express.static(path.join(__dirname, './')))
```

然后启动server.js:

``` bash
node server.js
```

最后就可以通过浏览器访问http://localhost:8080/build了 。 同时我们按照文章开始的时候描述的方式部署到服务器也可以正常进行访问了。

### 3. 文件压缩

除了解决了上面的部署问题之外，我发现我们最后打出来的bundle有点过大。所以，期间顺便通过在webpack的生产配置下运用插件将文件进行了压缩:

``` js
new webpack.optimize.UglifyJsPlugin({
	compress: {
		warnings: false
		}
	}),
```

### 4. 源码

> git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpack
git checkout 08
npm install
npm start

[第十一章](https://github.com/zhubaitian/alt-tutorial-webpack/tree/09)
