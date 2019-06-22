# 第九章 小白学react之由FOUC引发的一次webpack变革

![react-webpack.png](http://upload-images.jianshu.io/upload_images/264714-54b94b0e2dfda2a9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>*天地会珠海分舵注:随着微信应用号的呼之欲出，相信新一轮的APP变革即将发生。作为行业内人士，我们很应该去拥抱这个趋势。其中Reactjs相信是开发webapp的佼佼者，这段时间将会通过改造官方实例alt-tutorial来学习Reactjs相关的知识。*

上一篇《[小白学react之页面BaseLayout框架及微信的坑](http://techgogogo.com/2016/10/react_baselayout/)》我们学习了如何为各个Components提供一个基础的父框架组件来处理不同页面的Title的显示和Style样式的显示。

今天本人会尝试就自己踩到的一个坑开始，通过对webpack做进一步的修改，来学习更高级点的webpack相关的知识点。

主要需要解决的问题如下:

- FOUC问题
- 生产和开发配置分离
- 自动生成index.html页面模版文件
- 哈希文件名
- 清理垃圾构建文件

### 1. SCSS导入引发的问题 - FOUC之坑

今天在整理代码的时候碰到一个问题。就是初次加载页面的时候页面会出现短时间内的闪烁。也就是说，当我们首次加载页面或者刷新首屏的时候，会在很短的时间内先显示一下如下页面:

![home_li_flash_bef.png](http://upload-images.jianshu.io/upload_images/264714-24d7ab8490bdbb2c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到上面的两个li元素还是在没有应用上css之前的。然后很快的整个页面又回变成应用上css之后的页面：

![home_li_flash_aft.png](http://upload-images.jianshu.io/upload_images/264714-48b667c8ea23a069.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

作为小白，让人懊恼的一点是，碰到这种问题都不知道应该谷歌什么关键字！尝试过各种" reactjs first page refresh flash page reload sass import issue scss apply issue..."等一大堆而无果。最终无意发现原来是一个叫做FOUC (Fash Of Unstyled Content)的问题。
> flash of unstyled content (FOUC, also flash of unstyled text or FOUT)[1][2] is an instance where a web page appears briefly with the browser's default styles prior to loading an external CSS stylesheet, due to the web browser engine rendering the page before all information is retrieved. The page corrects itself as soon as the style rules are loaded and applied; however, the shift may be distracting. Related problems include flash of invisible text (FOIT) and flash of faux text (FOFT).

简单来说就是当样式表晚于结构性html 加载，当加载到此样式表时，页面将停止之前的渲染。此样式表被下载和解析后，将重新渲染页面，也就出现了短暂的闪烁现象。

据说诱因有几种：
>1，使用import方法导入样式表。
2，将样式表放在页面底部
3，有几个样式表，放在html结构的不同位置。

而解决方法就是：
> 解决方法：使用LINK标签将样式表放在文档HEAD中

因为我们的scss的样式确实是通过import的方式给导入到我们的各个页面的，所以我相信我们的诱因是第一种。以Home.jsx的样式表引入为例(上图中的两个li的渲染就是在Home页面中的):

``` jsx

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

```

那么根据给出来的解决方案，我们是应该在运行的时候将scss提取出来变成一个独立的css文件，然后在index.html的页面模版中将其引入。

加入提取出来的css文件叫做style.css，那么index.html的页面代码就应该改为:

``` html
<!doctype html>
<html >
  <head>
    <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body>
    <div id="ReactApp"></div>
  </body>
  <script src="bundle.js"></script>
</html>

```

那这里的问题就变成是如何生成这个css文件？根据我们之前的实战，整个源码在webpack打包之后其实就只有一个bundle.js文件而已。

### 2. webpack如何将scss打包成独立的css文件

为了将css打包成独立的一个文件，我们可以借助一个叫做extract-text-webpack-plugin的webpack插件，大家可以从其[github网页](https://github.com/webpack/extract-text-webpack-plugin)中查看到基本的信息以及使用实例。

首先，我们需要将该模块安装上：

``` bash
npm install extract-text-webpack-plugin --save-dev
```
 然后我们需要在我们的webpack.config.js文件中导入该模块:

``` js
let ExtractTextPlugin = require('extract-text-webpack-plugin');
```

跟着实例化一个对象:

``` js
var extractSCSS = new ExtractTextPlugin('[name].css');
```
注意这里的[name]是webpack上面的一个关键字，代表entry中的块(chunk)的键。比如我们的entry的定义如下:

``` js
    entry: {
        app: path.resolve(__dirname, 'src/App.jsx'),
    },
```
那么这个[name]就是这里的“app”。缺省的话会是“main”。

然后我们需要在plugins中加入这个实例：

``` js
 plugins: [
        new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
        extractSCSS,
    ]
```

最后，将scss文件的loader改成如下：

``` js
{
	test: /\.scss$/,
	//loaders: ["style", "css?sourceMap", "sass?sourceMap"]
	loader: extractSCSS.extract('style', 'css!sass?sourceMap'),
}
```

到此，我们的webpack.config.js配置文件就算支持上将scss文件抽取成一个独立的css文件的工作了。我们在执行webpack打包的时候，这个工作就会自动完成：

``` bash
npm run build
```

事成之后你会发现在build目录下自动会生成一个叫做app.css的文件。

但是，我们运行之前还需要做多一个事情，就是前面提到的需要将css文件放到index.html这个模版文件的header部分：

``` html
<!doctype html>
<html >
  <head>
    <link rel="stylesheet" type="text/css" href="app.css" />
  </head>
  <body>
    <div id="ReactApp"></div>
  </body>
  <script src="bundle.js"></script>
</html>

```

最后我们运行下面命令进行打包和启动express服务器：

``` bash
npm run prod
```

打开浏览器就能访问到我们熟悉的页面了。这时你会发现无论你怎么刷新网页，再也不会出现FOUC问题了。

当然，你也可以在开发模式下运行，bundle.js和app.css文件会自动在内存中生成，其效果是一样的:

``` bash
npm run dev
```

### 3. 分离开发和生产配置

### 3.1 混乱的配置
但是这里问题也随之而来了，我们在做项目的过程中，开发模式和生产模式的打包过程往往是不一样的。

比如，我们开发模式中我们需要制定webpack-dev-server的一些参数，而在生产模式下我们是不需要的。

只是我们之前将一长串的参数放到了package.json的scripts下面:

``` json
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server  --inline --devtool eval --host 0.0.0.0 --progress --colors --hot --content-base ./build --history-api-fallback",
    "prod": "npm run build & node server.js"
  },
```

其实更规范点的做法应该是将其一大串参数放到webpack.config.js里面，比如我们放在config下面：

``` js
    devServer: {
        historyApiFallback: true,
        //hot: true,
        inline: true,
        progress: true,
        // display only errors to reduce the amount of output
        stats: 'errors-only',
        devtool: eval,
        colors: true,
        contentBase: "./build",

        // parse host and port from env so this is easy
        // to customize
        host: "0.0.0.0",// process.env.HOST,
        port: process.env.PORT
    },
```

那么这就回到了我们上面提及的问题，这个devServer只是在开发模式才需要的，在生产模式下是不需要的。

其中生产模式我这里指的是package.json的scrip下的build命令，而开发模式指的是dev命令：

``` json
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server 
    "prod": "npm run build & node server.js"
  },
```

那么我们怎么样才能正确的将开发配置和生产配置分离开来呢？

#### 3.2. 区分打包环境之npm_lifecycle_event

在webpack.config.js中要将开发配置和生产配置分离开来，首先我们就要获取到当前的状态究竟是开发还是生产。

生产和开发，主要是体现在我们跑的命令是 "npm run build" 还是"npm run dev"， 也就是体现在package.json的scripts脚本的命令上。

那么我们在wepack.config.js中如果能判断到用户跑的究竟是哪个命令的话，我们就能达成这一点。

这时，特殊的环境变量npm_lifecycle_event就要登上舞台了。

npm 正在执行哪个 npm script， npm_lifecycle_event 环境变量值就会设为其值，比如

- 执行 npm run dev 命令时，则其值为 "dev" ；
- 执行 npm run build 命令时，其值为 "build" ；

所以，我们在webpack.config.js中首先需要做的就是获取到这个变量:

``` js
const TARGET = process.env.npm_lifecycle_event;
```

区分开当前需要打包的是开发环境还是生产环境之后，我们下一步要做的就是将它们的配置代码分开。

#### 3.3. 配置分离之webpack-merge

配置分离我们会用到的是webpack-merge这个包，我们先把它安装上:
 
``` bash
npm install webpack-merge --save-dev
```

webpack-merge是专门用来处理webpack.config.js的配置文件分离的。它主要提供一个merge方法，来将各个分开的配置项给合并在一起，详情请查看[github](https://github.com/survivejs/webpack-merge)。

下面我们就可以参考其网站的示例，将开发和生产的打包配置给分离开来了，代码如下：

``` js
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
const merge = require('webpack-merge');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractSCSS = new ExtractTextPlugin('[name].css');

const TARGET = process.env.npm_lifecycle_event;

var base = {
    entry: {
        app: path.resolve(__dirname, 'src/App.jsx'),
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,"build"),
    },

    module: {

        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react','stage-2']
                }
            }
        ]
    }
};

if(TARGET === 'dev' || !TARGET) {

    module.exports = merge(base, {
        devServer: {
            historyApiFallback: true,
            //hot: true,
            inline: true,
            progress: true,
            // display only errors to reduce the amount of output
            stats: 'errors-only',
            devtool: eval,
            colors: true,
            contentBase: "./build",

            // parse host and port from env so this is easy
            // to customize
            host: "0.0.0.0",// process.env.HOST,
            port: process.env.PORT
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loaders: ["style", "css?sourceMap", "sass?sourceMap"]
                }
            ]
        },

        plugins: [
            new OpenBrowserPlugin({url: 'http://localhost:8080'}),
        ]
    });
}

if(TARGET === 'build' || TARGET === 'prod') {

    module.exports = merge(base, {
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: extractSCSS.extract('style', 'css!sass?sourceMap'),
                }
            ]
        },
        plugins: [
            extractSCSS
        ]
    });
}
```

从代码可以看到，整个过程其实就是将配置文件拆分，以便能进行更灵活的自由组合配置。这里有几点稍微提一下的是：

- 我们原先是只有一个叫做config的配置项，现在因为需要做配置分离，所以我们将该配置项改成base。意思是这是一个基本配置，由下面的开发和生产配置继承和扩展
- 紧跟着我们会判断当前跑的是否是"npm run dev"命令或者是其他没有专门在package.json中指定的命令，如果是的话，就会通过webpack-merge的merge方法，将开发环境下打包所需要的特定配置项加入到上面的基本配置项上面，最后将配置给export出去。
- 往下的生产环境配置分离和开发环境的配置分离类似，这就不多说了。

配置分离解决后，我们下一个要解决的问题就是index.html页面模版文件的生成。

### 4. 控制index.html页面模版文件生成

为什么我们需要做这个事情呢？因为，此前我们的index.html文件是手动创建的，之前的css文件也没有独立打包出来，那么我们现在有了独立的css文件之后，我们就需要手动的将这个css文件加到index.html文件里面了。

如果这个css文件的名字固定的话，那么我们只是修改一次也没有多大问题。但是，如果像往下将要讲到的，打包出来的这个css文件如果每次都不一样的话，那么我们是不可能每次都去手动更新这个html文件的了。

为了达到这个目的，这里我们需要html-webpack-plugin的帮组。同理，我们先把这个模块给安装上:

``` bash
npm install html-webpack-plugin --save-dev
```

下一步就是跟着github上的项目[Readme](https://github.com/ampedandwired/html-webpack-plugin)去进行配置了。

首先，我们需要引入这个模块:

``` js
const HtmlWebpackPlugin = require('html-webpack-plugin');
```

然后，因为我们往下的HtmlWebpackPlugin配置在生成index.html的时候需要一个模版，所以我们先将原来的index.html该名为template.html，并修改内容如下:

``` html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
  <body>
    <div id="ReactApp"></div>
  </body>
</html>
```
这里我们去掉了css和bundle脚本的引入，因为这些往下会自动生成并插入到这个模版中生成新的index.html文件。

往下一步我们就需要去在webpack.config.js文件中继续配置该如何根据模版生成新的index.html文件了。

这些配置是要放到配置的plugins上的。我们这里有base的配置，production的配置和development的配置，那么，我们这里只对生产环境控制新index.html文件的生成，所以我们只需要在生产配置下进行plugins配置就好了:

``` js
if(TARGET === 'build' || TARGET === 'prod') {

    module.exports = merge(base, {
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: extractSCSS.extract('style', 'css!sass?sourceMap'),
                }
            ]
        },
        plugins: [
            extractSCSS,
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "build/template.html"),
            })
        ]
    });
}
```

其实从该plugin的github网站上可以看到，该插件是支持很多配置项的。因为我们这里的alt-tutorial演示项目比较简单，所以这里只用了template这个配置项，其他项默认。

默认的话，该插件会：

- 通过template这个设置项找到我们的template.html文件，并在内存中拷贝一份到index.html文件里面，然后针对内存中的该index.html文件进行往下的操纵
- 将webpack生成的css文件引入到index.html的head部分
- 将webpack生成的js文件引入到index.html的body部分
- 保存index.html到硬盘上

所以，在我们运行下面的命令之后:

``` bash
npm run build
```
我们会发现一个新的index.html文件将会在build目录下生成:

``` html
<!DOCTYPE html>
<html><head><link href="app.css" rel="stylesheet"></head>
  <head>
    <meta charset="UTF-8">
  <body>
    <div id="ReactApp"></div>
  <script type="text/javascript" src="bundle.js"></script></body>
</html>
```

### 5. Hash文件名以避免浏览器Cashe导致问题

有了上面的html文件自动生成的机制之后，我们现在就可以将生成的js文件和css文件给hash起来了。

为什么我们需要给这些文件的文件名做哈希呢？哈希的结果当然就是每次生成的文件的名字都会不一样了。但是名字不一样又是为哪出呢？

这主要是因为要处理浏览器cache导致的文件修改没有及时起效的问题。

比如，我们当前通过浏览器访问我们的开发服务器机器的时候，会去加载bundle.js文件。那么下次我有新的更新，重新编译之后，我再去通过浏览器去访问就会发现更新没有应用上。因为，这个时候浏览器发现bundle.js文件名没有变，它就会使用原来cache起来的bundle.js继续提供服务。这，就是为什么我们需要hash文件名。

其实hash文件名在webpack的配置中非常简单，我们只需要用上webpack中的另外一个关键字[chunkhash]就好了。

首先，我们修改base配置下的ouput项，将原来生成的bundle.js这个文件的文件名如下:

``` js
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname,"build"),
    },
```

build后生成的文件名将会是"app.xxxxx.js"，其中xxxxx代表的就是hash。

同时，我们修改生成的css文件的文件名如下:

``` js
var extractSCSS = new ExtractTextPlugin('[name].[chunkhash].css');
```

这时再运行:

``` bash
npm run build
```

我们就会看到build文件夹下面会生成添加了哈希值的js和css文件，同时，我们会注意到index.html文件也会随之而变:

``` html
<!DOCTYPE html>
<html><head><link href="app.4f8080c8499588890c06.css" rel="stylesheet"></head>
  <head>
    <meta charset="UTF-8">
  <body>
    <div id="ReactApp"></div>
  <script type="text/javascript" src="app.4f8080c8499588890c06.js"></script></body>
</html>
```

### 6. 清理垃圾构建文件

将文件名进行hash的同时，会引入一个新的问题：每次当我们修改了文件后进行重新构建，因为文件内容变了，所以hash出来的文件名也必然发生改变。那么在构建多此次之后，我们的build目录下就会布满一大堆充满哈希值的文件名的垃圾文件。

这时我们很有必要在构建前将其清理掉，以保持build目录的整洁干爽。

这里引入一个新的webpack插件[clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)，使用方法也非常简单。

 首先，我们跟往常一样将该插件给装上:

``` bash
npm install clean-webpack-plugin --save-dev
```

然后，我们在webpack.config.js中导入该模块：

``` js
const CleanPlugin = require('clean-webpack-plugin');
```

最后对生产配置的plugins进行修改。因为开发环境中这些文件都是在内存产生的，所以我们不需要进行任何配置。

``` js
new CleanPlugin(['build'], {
  root: path.resolve(__dirname,"./"),
  verbose: true,
  exclude: ['template.html','logo.png']
})
```

其中：

- build: 所需要清理的文件夹。就是相对下面的root路径下的build文件夹
- root: webpack.config.js文件所在的绝对路径
- exclue: 不需要清除的文件列表

至此，我们完成了对整个webpack.config.js进行了比较大的改动，整个项目的构建也就更像模像样了。

### 7. 源码

``` shell
git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpackgit
checkout 07
npm install
npm run prod
```

[第十章](https://github.com/zhubaitian/alt-tutorial-webpack/tree/07)
