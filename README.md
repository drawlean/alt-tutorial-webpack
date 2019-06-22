# 第一章 小白学react之altjs官方实例初探

![小程序开发工具](http://upload-images.jianshu.io/upload_images/264714-baa3e654ae040f6f?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
>*天地会珠海分舵注:随着微信应用号的呼之欲出，相信新一轮的APP变革即将发生。从获得微信应用号邀请的业内人士发出来的一张开发工具源码截图可以看到，reacjs及其相应的FLUX框架altjs很有可能会成为前端开发主流。作为行业内人士，自己之前从来没有做过web及webapp开发，所以这方面算是一名小白。这段时间在忙完工作之余准备储备一下这方面的知识点，以免将来被微信应用号的浪潮所淹没。*

本篇开始学习reactjs的FLUX框架altjs。学习最好的方法当然还是通过实例的阅读和改造了，但是学习之前，我们必须先要确保这些代码及其依赖的包是最新的，不然花了大时间而学习回来的是几年前的陈旧的知识就无谓了。

待通过本章将官方实例支持上最新的依赖包和工具包之后，往后会准备开几章来根据最新的altjs版本对代码进行改造，以及将打包工具从browserify改装成时下更流行的webpack，期待大家对techgogogo公众号的持续关注。

>注:开始之前希望大家对reactjs和FLUX有基本的了解，可以参考最后一小节。如果现在确实没有时间去了解的，也可以先根据本章的描述将实例搭建运行起来，到时对着代码修改调试，相信很多知识点就自然而然的通了。

#1. altjs官方实例下载
---
altjs官方提供了相应的入门实例，大家可以进入进入其官网查看：http://alt.js.org/guide/

实例的源码可以从github获得：https://github.com/goatslacker/alt-tutorial.git

我们首先将其clone下来:``` bashgit clone https://github.com/goatslacker/alt-tutorial.git```#2. 官方实例依赖安装---这是一个基于nodejs的项目，所有的依赖必然都是在项目的package.json中配置好的。

``` json
{ 
"name": "alt-tutorial",
"version": "1.0.0",
"description": "A simple flux tutorial built with alt and react",
 "main": "server.js", 
"dependencies": { "alt": "^0.16.0", "react": "^0.12.2" }, 
"devDependencies": { "browserify": "^8.0.3", "reactify": "^0.17.1" }, 
"scripts": { "build": "browserify -t [reactify --es6] src/App.jsx > build/app.js", 
"start": "npm run build && open 'index.html' " }, 
"author": "Josh Perez <josh@goatslacker.com>", 
"license": "MIT"}

```
所以源码clone下来后我们首先要做的就是在项目中执行npm install去安装package.json中指定的依赖了。
``` bash
npm install
```

# 3. 官方实例运行
---
依赖安装完后我们返回来再看下package.json中的scripts那部分配置:``` json{ "scripts": { "build": "browserify -t [reactify --es6] src/App.jsx > build/app.js", "start": "npm run build && open 'index.html' " },}``` 可以看到整个项目是通过browserify来进行构建管理的(往后我准备将其切换成更流行的webpack)，而在运行命令“start“中会自动调用“build“来进行构建，构建好后就直接在浏览器中打开index.html进行显示。所以我们现在直接调用“start“来构建并运行：``` bashnpm run start```然后默认浏览器（我的是chrome）就会打开相应的页面，我们可以点击“favorite“按钮来将相应的location加到Favorite下面：![运行页面](http://upload-images.jianshu.io/upload_images/264714-f791d3f7c3c38446?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

玩了下会发现这个例子很简单直观，就是上面显示相应的一些地名Locations，然后通过点击每个地名后面的Favorite按钮可以将对应的地名添加到下面的Favorites列表里面。

# 4. 依赖升级
---
##4.1 依赖包升级状态查看

从官方实例的修改历史可以看到，该实例代码有点老了，特别是在nodejs更新迭代如此快速的今天。

![altjs官方实例](http://upload-images.jianshu.io/upload_images/264714-89cafcef4234e952?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们也可以通过npm来查看依赖模块的版本情况：

``` bash
npm outdate
```
![npm update](http://upload-images.jianshu.io/upload_images/264714-4834e30db2fb468c?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其中:
- Package: 依赖包的名字
- Current: 当前安装版本
- Wanted: Package.json中期望的版本
- Latest: 当前市面最新的版本

## 4.2 软件运行依赖包升级

那么我们如何将这些依赖包批量升级到最新版本呢？我找到的一个方法是，首先将package.json中"dependencies"或"devDependencies"的所有的依赖包项设置成＊号，然后再执行npm update, 然后就会获得最新版本。

我们先进行软件运行依赖包dependencies的升级：
``` json
{ "name": "alt-tutorial", 
"version": "1.0.0", 
"description": "A simple flux tutorial built with alt and react",
 "main": "server.js", 
"dependencies": { "alt": "*", "react": "*" },
 "devDependencies": { "browserify": "^8.0.3", "reactify": "^0.17.1" }, 
"scripts": { "build": "browserify -t [reactify --es6] src/App.jsx > build/app.js", 
"start": "npm run build && open 'index.html' " },
 "author": "Josh Perez <josh@goatslacker.com>", 
"license": "MIT"}
```
然后执行npm update --save来安装最新的版本并记录到package.json里面
```
 bashnpm update --save
```
安装完成后执行 npm oudate
``` 
bashnpm outdate
```
![npm outdate](http://upload-images.jianshu.io/upload_images/264714-7a75de53522d9597?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到dependencies的依赖已经更新到最新的版本（所以没有显示出来，因为这个命令是查看是否需要更新的）。但是开发工具相关的依赖devDependencies还没有更新，因为我们刚才只是将dependencies相关的依赖设置成＊号来进行批量更新。

最后查看package.json可以看到dependencies已经更新到最新版本:
``` json
{ "name": "alt-tutorial", 
"version": "1.0.0",
 "description": "A simple flux tutorial built with alt and react", 
"main": "server.js", 
"dependencies": { "alt": "^0.18.6", "react": "^15.3.2" }, 
"devDependencies": { "browserify": "^8.0.3", "reactify": "^0.17.1" }, 
"scripts": { 
"build": "browserify -t [reactify --es6] src/App.jsx >build/app.js", 
"start": "npm run build && open 'index.html' "
 },
 "author": "Josh Perez <josh@goatslacker.com>", 
"license": "MIT"}
```

## 4.3 软件开发依赖包升级
---
接下来我们将开发工具包devDependencies也一并更新了。同理，我们先将package.json中devDependencies相关的依赖项设置成＊：
``` json
{ "name": "alt-tutorial",
 "version": "1.0.0", 
"description": "A simple flux tutorial built with alt and react",
 "main": "server.js", 
"dependencies": { "alt": "^0.18.6", "react": "^15.3.2" }, 
"devDependencies": { "browserify": "*", "reactify": "*" },
 "scripts": { "build": "browserify -t [reactify --es6] src/App.jsx > build/app.js", "start": "npm run build && open 'index.html' " }, 
"author": "Josh Perez <josh@goatslacker.com>",
 "license": "MIT"}
```
这次我们使用npm update --save-dev命令来更新开发依赖包
``` bash
npm update --save-dev
```
最后我们将会发现package.json中的devDependencies的依赖项也全部更新了过来：
``` bash
{ "name": "alt-tutorial", 
"version": "1.0.0", 
"description": "A simple flux tutorial built with alt and react",
 "main": "server.js", 
"dependencies": { "alt": "^0.18.6", "react": "^15.3.2" }, "devDependencies": { "browserify": "^13.1.0", "reactify": "^1.1.1" }, "scripts": { "build": "browserify -t [reactify --es6] src/App.jsx > build/app.js", 
"start": "npm run build && open 'index.html' " }, 
"author": "Josh Perez <josh@goatslacker.com>",
 "license": "MIT"}
```
这时再通过npm outdate命令将不会看到有需要升级的依赖包。到此，我们的全部依赖包都已经升级到最新。

# 5. AltContainer依赖包找不到错误
---
此时志得意满(*原谅我用这个词，小白都是比较容易满足的*)的我准备npm run start来一气呵成的运行起整个实例的时候，却发现根本跑不起来：
![AltContainer-Error](http://upload-images.jianshu.io/upload_images/264714-3ab9773191ee8411?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

根据提示，应该是src/component下的web组件有使用到alt的AltContainer这个包，而在升级依赖包后，这个包却找不到了。我们首先看下代码中引用到AltContainer的地方，根据提示，打开项目的src/components文件夹，可以看到下面有一个Locations.jsx文件，打开后看到文件最开始有对AltContainer的引用:
``` js
var React = require('react');
var AltContainer = require('alt/AltContainer');
```
根据经验，出现这种问题的时候无非是两个原因：
1. 这个依赖包没有正确安装
2. 升级后的依赖包调用/引用方式变了。

发生这种事情，第一时间想到的肯定是去altjs的官网查看了。在官网的[API Documentation](http://alt.js.org/docs/components/altContainer/)中很明显AltContainer的引用方式已经变了:

![new way to import AltContainer](http://upload-images.jianshu.io/upload_images/264714-296308a5aa6228f9?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

引用的不再是'alt/AltContainer'，而是'alt-container'，至于官网提示中使用的关键字'import'，猜想应该是es6最新导入方式，现在先不管，今后学习过程中有可能将这个项目的代码转换成es6，敬请期待。所以我们这里只需要根据官网提示将引用方式改成以下就好了：
```js
 var React = require('react');
var AltContainer = require('alt-container');
```
当然，我们还是需要将这个依赖包给装上的：
``` bash
npm install alt-container --save
```
这时我们再构建运行：
``` bash
npm run start
```
会发现依然有报错，但是已经不是AltContainer引用找不到的错误了。

# 6. chromeDebug模块找不到错误
---
从以上命令的输出我们可以看到这次的错误是模块alt下的utils中找不到chromeDebug这个引用：
![chromeDebug-not-found](http://upload-images.jianshu.io/upload_images/264714-3ac6f04313c36dcd?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这此在altjs官网没有找到相应的解决办法，但是问了下google，发现原来chromeDebug已经改成在alt-utils这个独立的模块的lib之下，所以只需要将相应的引用代码改一改就好了。根据提示，找到出现问题的代码是在src/alt.js代码中：
``` jsx
var Alt = require('alt');
var alt = new Alt();
var chromeDebug = require('alt/utils/chromeDebug')chromeDebug(alt);
module.exports = alt;
```
这里我们需要将chromeDebug的引用改成"alt-utils/lib/chromeDebug":
``` js
var Alt = require('alt');
var alt = new Alt();
var chromeDebug = require('alt-utils/lib/chromeDebug')
chromeDebug(alt);
module.exports = alt;
```
然后我们安装上alt-utils模块并将依赖保存到package.json下面
``` bash
npm install alt-utils --save
```
这时再跑“ npm run start“的时候就不会再报任何错误。

# 7. React.render没定义错误
---
但是这时打开的是空白网页，打开chrome的开发者工具查看时发现错误如下：
![react.rendor not a function](http://upload-images.jianshu.io/upload_images/264714-77189fd819f9e673?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

原因是在最新的reactjs版本中，渲染函数应该调用的是react-dom模块中的render，而非调用react模块中的render。追查后发现问题是处在src/App.jsx文件中：
``` jsx
var React = require('react');
var Locations = require('./components/Locations.jsx');
React.render( <Locations />, document.getElementById('ReactApp'));
```
这里我们需要改成:
``` jsx
var React = require('react');
var ReactDOM = require('react-dom');
var Locations = require('./components/Locations.jsx');
ReactDOM.render( <Locations />, document.getElementById('ReactApp'));
```
安装react-dom依赖模块:
``` bash
npm install react-dom --save
```
然后构建运行：
``` bash
npm run build
```
# 8. dispatch 函数未定义错误
---
这时我们查看打开的网页，可以看到Locations和Favorites两个列表的标题都已经显示出来，但是Locations下面的内容却没有显示。打开chrome开发调试工具：
![dispatch-not-found](http://upload-images.jianshu.io/upload_images/264714-8d96ff2a71b80134?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

发现是LocationActions.js中，每个action都调用了dispatch方法:
``` js
var alt = require('../alt');
class LocationActions { 
  updateLocations(locations) { 
      this.dispatch(locations); 
  } 
  fetchLocations() { 
      this.dispatch(); 
  }
  locationsFailed(errorMessage) { 
      this.dispatch(errorMessage); 
  } 
  favoriteLocation(location) { 
      this.dispatch(location); 
  }
}
module.exports = alt.createActions(LocationActions);
```
查看altjs官网得知，最新版本中我们不应该显式调用dispatch来将action分发到store，而是应该通过return来达成。所以最终的代码应该改成：
``` js
var alt = require('../alt');
class LocationActions { 
  updateLocations(locations) { 
    return locations; 
  } 
  fetchLocations() { 
    return null; 
  } 
  locationsFailed(errorMessage) { 
    return errorMessage; 
  } 
  favoriteLocation(location) { 
    return location; 
  }
}
module.exports = alt.createActions(LocationActions);
```
运行npm run start命令后我们可以看到整个页面能够正常显示和操作：![page](http://upload-images.jianshu.io/upload_images/264714-f7a33046b86cbff8?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 9. 小结
---
作为一名小白，通过这次的实践，这里主要有几个地方需要小结下以便给自己提个醒:
- 通过npm outdate查看当前依赖包的版本状况
- 通过将package.json的依赖包的版本信息设置成＊号，然后通过“npm update --save“ 或者“npm update --save-dev“ 可以批量将所有的依赖包升级到最新版本（这里如果有其它更好的办法的请在评论中指教）
- 官方的reactjs-tutorial实例并没有及时更新，稍不留神就可能学到的是一些陈旧的知识- 碰到问题时可以先考虑去官网找答案，效率往往会比去google来得快且准确

本章的相关代码已经放到github，本人fork了alt-tutorial到alt-tutorial-webpack，大家可以clone出来然后切换到01这个branch来查看本篇文章涉及的相应代码修改。

github地址：https://github.com/kzlathander/alt-tutorial-webpack.git

# 10. 准备知识
---
如果对reactjs和flux的基本概念不清楚的，请先查看阮一峰网络日记中的相应文章：
- reactjs基本概念：请参考阮一峰的《[Flux 架构入门教程](http://www.ruanyifeng.com/blog/2016/01/flux.html)》
- flux基本概念：请参考阮一峰的《[React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)》

# 11. 运行

- git clone https://github.com/kzlathander/alt-tutorial-webpack.git
- cd alt-tutorial-webpack
- git checkout 01
- npm install
- npm start

[第二章](https://github.com/zhubaitian/alt-tutorial-webpack/tree/02)
