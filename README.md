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

 ```
 git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpackgit 
checkout 05
npm install
npm run prod
```

# 第七章 小白学react之SASS实战

>*天地会珠海分舵注:随着微信应用号的呼之欲出，相信新一轮的APP变革即将发生。作为行业内人士，我们很应该去拥抱这个趋势。其中Reactjs相信是开发webapp的佼佼者，这段时间将会通过改造官方实例alt-tutorial来学习Reactjs相关的知识。*

上一篇《[小白学react之restful api获取服务器数据实战](http://techgogogo.com/2016/09/restful_api/)》我们学习了如何通过superagent的两个模块提供的功能，调用远程Express服务器上通过restful api提供的数据，并且学习了如何打造一个简单的Express api服务器。

今天本人准备将我们的示例应用alt-tutorial加上css的支持，以便能更好的呈现。以下是最终效果：

![Locations_table_view.png](http://upload-images.jianshu.io/upload_images/264714-076750ed87eea9ca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

本篇开始之前，如果看官跟我一样对SASS没有怎么接触过的，敬请先去看下阮一峰的《[SASS用法指南](http://www.ruanyifeng.com/blog/2012/06/sass.html)》，有个基本概念，我们再进行实战。

### 1. SASS Loader 和 sourceMap特性

像我们系列的第二篇《[小白学react之webpack实战](http://techgogogo.com/2016/09/webpack-in-action/)》中所描述，为了能让我们的webpack在打包的时候可以正确解析到jsx格式的文件，我们需要加入bable这个loader的支持。同样，这里我们为了让webpack在打包时能正确解析到scss，我们也需要加上相应的loaders。

我们打开webpack.config.js，在loaders代码块里面加入以下代码:

``` javascript
{
  test: /\.scss$/,
  loaders: ["style", "css?sourceMap", "sass?sourceMap"]
}
```

这里style，css和sass这几个loader的功能都比较直观，我们知道"?sourceMap"这个语法的意思是开启对应模块的sourceMap属性，那么这个sourceMap又是干什么用的呢？

其实这里主要的目的就是方便我们调试sass代码。因为sass代码最终还是要编译成css的，而我们在调试的时候，我们更愿意在Chrome的开发者工具中能够直接看到我们的sass代码来进行调试。我们要知道，sass的代码在编译成css后，变化可能会比较大的。

比如我们将要说到的Home页面的scss代码:

``` scss
.home {
    &__li {

        list-style: none;
        height: rem(60px);
        vertical-align: middle;
        float:left;
        padding-right: rem(60px);

        &:hover { background: #31b0d5;
        }

    }
}

```

在编译之后就会变成：

``` css
.home__li {
  list-style: none;
  height: 1.5rem;
  vertical-align: middle;
  float: left;
  padding-right: 1.5rem; }
  .home__li:hover {
    background: #31b0d5; }

```

我们可以看到两者肯定是有区别的了。那如果我们在相应的loader中没有开启sourceMap的特性的话，我们在chrome的开发者工具中看到的将会是这个样子的：

![chrom_no_sourceMap.png](http://upload-images.jianshu.io/upload_images/264714-dd2a304527ff967a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到我们是没有办法看到我们的sass源码的。

如果我们将对应的loaders的sourceMap特性启动起来，那么我们在通过chrome的开发者工具进行调试的时候将会看到的是这样的：

![chome_style_with_sourceMap.png](http://upload-images.jianshu.io/upload_images/264714-b3f0d12feffa4e44.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到在右边的style中我们不但可以看到编译后的css代码，在该css代码的右上角，我们还可以看到有我们的sass源码的链接，点击该链接进去:

![chrome_source_home__li.png](http://upload-images.jianshu.io/upload_images/264714-c8e1f29e9742871e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们就可以看到我们的sass的源码了。所以说，sourceMap主要就是为了方便我们进行调试用的。

### 2. sass 实现像素到rem的转换

sass相对css，亮眼的功能之一就是支持通过编程的方式操作css。

相信大家都清楚css3引入的rem的作用，它参照的是页面根元素html的字体大小，所以1rem的大小就等同于页面根元素的大小，2rem大大小就是页面根元素的2倍大小。

通过这种使用方法，我们可以提升我们的应用的可扩展性及可移植性。因为我们整个应用使用的是相对页面根元素的大小，所以无论运行浏览器怎么变，平台怎么变，代码都能很好的自适应。

但是css3没有出来之前，我们很多人应该习惯了直接使用像素来进行元素大小的设置。那么我们如果能允许大家继续使用像素来设置大小，但是背后自动将像素转换成rem，那该是很好的事情，皆大欢喜了。

比如我们可以提供一个叫做rem的sass方法，接收输入像素大小作为单位，然后自动将其转换为相对html字体大小的rem返回。但是这个输入的像素大小应该相对于几倍的html根页面字体元素的大小呢？这里我们就需要设定好一个参考值了。

比如我们可以设定参考值为40px，那么调用方法rem(60px)的话，我们预期返回来的就是1.5rem。

下面我们看下具体代码的实现：
 
``` scss
$relative-font-size: 40px !default;

@function strip-unit($num) {
  @return $num / ($num * 0 + 1);
}

@function rem($value) {
  $v: strip-unit($value);
  $relative: strip-unit($relative-font-size);
  @return $v/$relative + rem
}
```

这里的relative-font-size就是我们上面说的参考值。注意这里的!default语法，意思是将40px作为这个变量的默认值，用户可以在其它地方将其覆盖，比如如果在前面加上:

``` scss
$relative-font-size: 60px;
$relative-font-size: 40px !default;
...
```

那么实际上该变量的值被改写成了60px，而不是默认值40px。

这里的strip-unit方法的意思是将输入像素的单位"px"给去掉。sass对这种单位运算的处理非常智能，比如以输入为"$num = 60px"为例子，下面的“$num*0”的结果将会是0px，那么"0px + 1"，虽然后后面没有px单位，但是结果会自动补上，变成“1px”。那么最后的"60px/1px"的结果就是60，px这个单位就会去掉了。

也许这里大家会说，那我们直接写成下面不就完了？

``` scss
@function strip-unit($num) {
  @return $num / 1px;
}
```
如果我们只是支持去掉像素的单位的话，这样是ok的，但是如果我们要支持去掉其它格式的单位，比如em转rem之类的，这样写就没有人和可扩展性可言了。

知道了strip-unit的作用，下面的rem的代码就很好理解了:

- 首先将输入的像素(如60px)的单位给去掉
- 将相对字体大小的单位也剥离掉
- 将剥离掉单位的输入的像素大小除以相对字体像素大小，得到的结果加上rem，就是我们的输入像素转换成rem后的结果

这时我们在scss就可以直接通过以下这种方式来使用这个方法：

``` scss
height: rem(60px);
```

编译后的结果就是

``` scss
height: 1.5rem;
```

### 3. Home页面sass实战

#### 3.1 Home页面组件代码基本改造

Home 页面的两个链接原来没有应用任何css样式的时候是这个样子的：

![home_link_org.png](http://upload-images.jianshu.io/upload_images/264714-e8b89ebdc04131df.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

那么我们希望将其改造成

![home_link_scss.png](http://upload-images.jianshu.io/upload_images/264714-5dba15c5b86e3376.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

原来的代码是:

``` js
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
```

那么为了更好的应用我们的样式，我们在link上层封装多一层列表项目li。

``` jsx
 <li><Link to="/locations" >名胜古迹</Link></li>
<li><Link to="/about" >关于techgogogo</Link></li>
```
这时的显示效果就是:

![home_link_bare_li.png](http://upload-images.jianshu.io/upload_images/264714-5ee0b84355f285fe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这时如果需要在li中加入scss样式的支持，只需要在属性中加入"className="xxx"就好了。

``` jsx
<li className="xxx"><Link to="/locations" >名胜古迹</Link></li>
<li className="xxx"><Link to="/about" >关于techgogogo</Link></li>
```

当然，此前我们需要在文件中引入scss文件，比如我们的Home页面的scss文件:

``` jsx
import  './Home.scss'
```

#### 3.2 sass选择器嵌套和命令空间污染

sass支持选择器的嵌套。比如我们需要在Home页面下面的li元素上应用样式，我们可以直接写成:

``` scss
.li {
  ...//样式定义
}
```
那么在Home页面我们直接引用"className="li""就能应用上该样式。那么假如我们Home页面的li除了有应用到导航栏的标签之外，其它部分也有用到li的话，那么我们的li样式就乱了。

我们以前通常的方法是通过修改css类的名字来解决这种冲突，比如可以将名字改成home__tab__li:

``` scss
.home__tab__li {
  ...//样式定义
}
```
其它在body中用到的li样式的类名就改成home__body__li: 

``` scss
.home__body__li {
  ...//样式定义
}
```

其实sass中有个更简单的方法来解决这个问题，那就是类选择器支持嵌套，比如".home_tab_li"其实我们可以在顶层定义一个叫做home的命名空间，然后通过“&”来引用父元素来达成这个目标:

``` scss
.home {
    &__tab {
        &__li {
          ...
        }
    }
}

```

这样我们就可以在页面代码中直接引用li的样式了"className="home__tab__li"，如果在body中有其它li需要不同的样式的，我们也同样可以通过这种命名空间隔离的方式来唯一定义对应元素，而不需要担心命名空间污染带来的麻烦。

### 3.3 Home页面scss代码实战

有了上面这些基础后，我们的Home页面的scss代码的编写就很得心应手了。

我们在src/components页面上添加一个Home.scss文件，编写代码如下:

``` scss
@import '../libs/_rem.scss';

.home {
    &__tab {
        &__li {

            list-style: none;
            height: rem(60px);
            vertical-align: middle;
            float:left;
            padding-right: rem(60px);

            &:hover { background: #31b0d5;}

        }
    }
}
```
这里第一行引进来的_rem.scss就是我们前面说的对rem方法的一个封装。

li样式的配置更多的是css的基础知识，我这里对每一个设置描述一下:

- list-style行: 将li列表前面的实心圆圈符号给去掉。
- height行: 设置列表的高度，这个高度需要比默认字符大小大点，不然字体在列表中就会显示不完整，不美观。记得我们之前是将全局相对像素设置成40px的，所以这里的rem(60px)就是1.5rem，也就是li的高度是数字大小的1.5倍。
- vertical-align行：设置字体垂直靠中显示
- float行: 设置li列表自动往左浮动。也就是说应用了这个li样式的列表都会自动往左浮动排列，而不会像现在这样分成两行显示。但是浮动之后记得需要清浮动，否则下面的空间也会跟着一并浮动上去。
- padding-right行: 每个列表右边的填充空间。其实就是为了不让两个列表紧靠在一起，这里是在两个列表之间填充1.5个字符大小的空间
- hover行: 设置在鼠标移动到li标签上面时候的背景颜色

然后我们需要对Home页面代码也修改下，加入对home__tab__li样式的引用，以及清浮动:

``` jsx
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
```

最终效果如下:

![home_link_scss.png](http://upload-images.jianshu.io/upload_images/264714-5dba15c5b86e3376.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 4. 表格显示Locations和Favorites

改造之前，我们的Locations页面是这样子的：

![Location_org.png](http://upload-images.jianshu.io/upload_images/264714-d3c2f3b90005d0e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

通过加入样式的支持，我们最终将会将页面改造成：

![Locations_table_view.png](http://upload-images.jianshu.io/upload_images/264714-076750ed87eea9ca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其中整个套路跟刚才给Home页面加入scss的支持是一样的，只是具体一些css格式的细节的微调会稍微复杂一点而已。

这里我就不一项项的阐述了，大家可以下载相应的代码进行参考。

### 5. 源码

``` shell
git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpackgit
checkout 05
npm install
npm run dev
```

[第八章](https://github.com/zhubaitian/alt-tutorial-webpack/tree/06)

