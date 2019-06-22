# 第六章 小白学react之restful api获取服务器数据实战

>天地会珠海分舵注:随着微信应用号的呼之欲出，相信新一轮的APP变革即将发生。作为行业内人士，我们很应该去拥抱这个趋势。其中Reactjs相信是开发webapp的佼佼者，这段时间将会通过改造官方实例alt-tutorial来学习Reactjs相关的知识。

通过上一篇文章《[小白学react之React Router实战](http://techgogogo.com/2016/09/react_router/)》我们学习了在React Router的基本功能，并根据路由功能建立了一个导航栏，可以方便的切换查看Locations和About。

但是，这里Locations的数据还是在客户端模拟出来的。作为前端应用，和服务器端打交道是在所难免的了。

所以，今天我们准备做一个事情，从服务器端获取真实的Locations数据。

# 1. Express提供数据

上一篇文章中，我们为了解决React Router的BrowserHistory引发的404 Page Not Found问题，编写了一个Express的服务器。我们可以在该服务器的基础上加入相应的代码来提供数据给前端。

我们先回顾下原来的server.js的代码:

``` js
var express = require('express')
var path = require('path')

var app = express()

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'build')))

var PORT = 8080
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})
```

我们这里要做的就是截获用户请求，当用户请求“/api/locations"的时候，将Locations的数据发送回客户端。

所以需要增加的代码非常简单:

``` js

let locations = [
  { id: 0, name: 'Abu Dhabi' },
  { id: 1, name: 'Berlin' },
  { id: 2, name: 'Bogota' },
  { id: 3, name: 'Buenos Aires' },
  { id: 4, name: 'Cairo' },
  { id: 5, name: 'Chicago' },
  { id: 6, name: 'Lima' },
  { id: 7, name: 'London' },
  { id: 8, name: 'Miami' },
  { id: 9, name: 'Moscow' },
  { id: 10, name: 'Mumbai' },
  { id: 11, name: 'Paris' },
  { id: 12, name: 'San Francisco' }
];
app.get("/api/locations", function(req,res) {
  res.send(locations);
})

```

- 定义Locations数据
- 截获用户访问请求，如果请求是"/api/locatiions"，则将Locations 数据返回给客户端

这里为两个更好的显示效果，我们通过Promise和setTimeout来加入同步和延时，让客户端感觉到这个网络数据的获取需要一定的时间，而不是像在本地一样立刻有返回。

``` js
app.get("/api/locations", function(req,res) {

  new Promise(function (resolve, reject) {
    // simulate an asynchronous flow
    setTimeout(function () {

      // change this to `false` to see the error action being handled.
      if (true) {
        // resolve with some mock data
        res.send(locations);
        resolve();
      } else {
        reject('Things have broken');
      }
    }, 1000);
  });

})
```
这段代码大概的意思就是，通过setTimeout来设置一定时间的延时，因为setTimeout是异步的操作，所以我们通过Promise来将其变成同步。当睡眠1秒钟之后，将数据locations发回客户端。

到此，Express服务器的代码就准备完毕了，最终代码如下:

``` js
var express = require('express')
var path = require('path')

var app = express()

let locations = [
  { id: 0, name: 'Abu Dhabi' },
  { id: 1, name: 'Berlin' },
  { id: 2, name: 'Bogota' },
  { id: 3, name: 'Buenos Aires' },
  { id: 4, name: 'Cairo' },
  { id: 5, name: 'Chicago' },
  { id: 6, name: 'Lima' },
  { id: 7, name: 'London' },
  { id: 8, name: 'Miami' },
  { id: 9, name: 'Moscow' },
  { id: 10, name: 'Mumbai' },
  { id: 11, name: 'Paris' },
  { id: 12, name: 'San Francisco' }
];

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'build')))

app.get("/api/locations", function(req,res) {

  new Promise(function (resolve, reject) {
    // simulate an asynchronous flow
    setTimeout(function () {

      // change this to `false` to see the error action being handled.
      if (true) {
        // resolve with some mock data
        res.send(locations);
        resolve();
      } else {
        reject('Things have broken');
      }
    }, 1000);
  });

})

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

var PORT = 8080
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})
```

# 2. 客户端通过restful api获取数据

客户端获取服务器端的数据的方法有很多实现，这里我们用到的是superagent的两个模块:

- [superagent-defaults](https://github.com/camshaft/superagent-defaults): 发送网络请求的一个模块。
- [superagent-promise-plugin](https://github.com/jomaxx/superagent-promise-plugin/blob/master/README.md): 可以将superagent的网络请求方法封装成Promise，让我们更好的做同步控制。配合上es6的co模块，代码将会变得异常简洁。

这两个模块的详细使用方法请点击上面的两个链接进去查看。我们这里的使用非常简单，就不做过多的研究和详述。

我们打开src/sources/LocationSource.js文件，将代码修改如下:

``` js
import defaults from 'superagent-defaults';
import superagentPromisePlugin from 'superagent-promise-plugin';
var LocationActions = require('../actions/LocationActions');
import co from 'co';
const request = superagentPromisePlugin(defaults());

var mockData = [
  { id: 0, name: 'Abu Dhabi' },
  { id: 1, name: 'Berlin' },
  { id: 2, name: 'Bogota' },
  { id: 3, name: 'Buenos Aires' },
  { id: 4, name: 'Cairo' },
  { id: 5, name: 'Chicago' },
  { id: 6, name: 'Lima' },
  { id: 7, name: 'London' },
  { id: 8, name: 'Miami' },
  { id: 9, name: 'Moscow' },
  { id: 10, name: 'Mumbai' },
  { id: 11, name: 'Paris' },
  { id: 12, name: 'San Francisco' }
];

var LocationSource = {
  fetchLocations() {
    return {
      remote() {
        return co(function *() {
          const resp = yield request.get(`/api/locations`);
          return resp.body;
        });
      },

      local() {
        // Never check locally, always fetch remotely.
        return null;
      },

      success: LocationActions.updateLocations,
      error: LocationActions.locationsFailed,
      loading: LocationActions.fetchLocations
    }
  }
};

module.exports = LocationSource;

```

事实上我们改动的关键代码只有以下这小部分:

``` js
      remote() {
        return co(function *() {
          const resp = yield request.get(`/api/locations`);
          return resp.body;

        });
      },
```

可以看出来，通过这两个模块来处理网络请求是非行简单的。大家可以自己亲手尝试下。

当然，尝试之前别忘记把这两个模块通过npm给安装上。

这里因为我们使用了一些es6的特性，我们前几章安装babel的那些基本模块是没有完整支持上的。所以这里我们还需要加入babel-polyfill模块的支持。

通过npm安装上babel-polyfill后，我们在入口文件App.jsx上直接加入以下这行代码，整个项目就能顺利跑起来了。

``` js
import "babel-polyfill";
```

如果没有这个包的支持的话，浏览器调试的时候将会收到"regeneratorRuntime is not defined"的错误。

# 3. 源码获取

> git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpackgit 
checkout 05
npm install
npm run prod

[第七章](https://github.com/zhubaitian/alt-tutorial-webpack/tree/06)
