# 第四章 小白学react之Webpack实战

![](http://upload-images.jianshu.io/upload_images/264714-5abd27079248ebc7?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
>*天地会珠海分舵注:随着微信应用号的呼之欲出，相信新一轮的APP变革即将发生。作为行业内人士，我们很应该去拥抱这个趋势。这段时间在忙完工作之余准备储备一下这方面的知识点，以免将来被微信应用号的浪潮所淹没*

通过上一篇《[微信应用号开发知识贮备之altjs官方实例初探](http://techgogogo.com/2016/09/altjs_tutorial_upgrade/)》，我们已经将altjs的官方实例所用到的依赖包升到最新，且修改的源码相应的部分来适应最新的依赖。

今天本人的目标是将实例中的打包工具从browserify切换到当前更火的更接近nodejs编写习惯的weback上来。既然要用wepack，那么当然就需要去学习一下weback相关的基本知识了。

因为altjs的官方实例不复杂，所以有针对性的学习需要用到的webpack功能，够用就好。至于今后需要扩展的，另外开篇再说。

# 1. weback 配置文件简介

根据webpack官网的说法，Webpack 是当下最热门的前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。通过 loader 的转换，任何形式的资源都可以视作模块，比如 ES6 模块、CSS、图片、 JSON等。其实无论是哪种打包工具，最终的目的就是将所有依赖打包到相应的一个或者多个独立的文件上来。

比如以我们官方的altjs-tutorial项目为例，我么可以看到顶层的入口index.html代码非常简单:
``` html
<!doctype html>
<html> 
<head>
 </head> 
<body> 
<div id="ReactApp"></div>
 </body> 
<script src="build/app.js"></script>
</html>
```
最终使用到的脚本其实就是build/app.js这个bundle文件，而这个文件就是通过package.json中指定的browserify命令打包而成的:
``` json 
"scripts": { 
"build": "browserify -t [reactify --es6] src/App.jsx > build/app.js", 
"start": "npm run build && open 'index.html' " },

```
其实webpack也一样，最终的目的也是通过相应的规则和策略生成相应的bundle文件。

## 1.1. 配置文件基本项简介

webpack的使用主要就是围绕着对应的配置文件webpack.config.js来进行的，这就是我们上面所说的规则和策略。我们可以通过这个配置文件来对如何将项目进行打包进行配置，最基本的配置相信有以下方面：
- 依赖遍历入口。webpack打包的最终目的就是找出所有相关的依赖，然后将需要的依赖打包成独立的文件，所以必然需要找到遍历的入口文件。
- 输出bundle。将所有依赖打包好后，我们应该将其放到一个固定的地方，以便我们的顶层入口程序(index.html)可以引用到。
- 依赖文件类型解析和转换。因为不同的文件可能需要不同的规则来进行解析，比如配合reactjs的组件文件格式jsx，和javascript的语法规则就不一样，所以需要用到其它解析器或者转换器来将其转成javascript格式，以便打包到同一个bundle里面。这里我们统一将这些解析器和转换器称作加载器。

下面就是摘录自webpack官网的一个典型的webpack配置文件，其目的就是通过bable-loader这个加载器来将将项目中从src/app.js遍历得出的js后缀的依赖文件，打包成./bin/app.bundle.js文件。
``` js 
module.exports = {
 entry: './src/app.js',
 output: { path: './bin', filename: 'app.bundle.js', }, 
module: { loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }] } 
}
```
这里的基本项意义就是：
- entry：依赖遍历入口文件
- output：bundle打包结果，其中path定义了输出的文件夹，filename则定义了打包结果文件的名称module：定义了对依赖模块的处理逻辑，这里可以用loaders定义了一系列的加载器，以及一些正则。当需要加载的文件匹配test的正则时，就会调用后面的loader对文件进行处理，这正是webpack强大的原因。比如这里定义了凡是.js结尾的文件都是用babel-loader做处理。当然这些loader也需要通过npm install安装

## 1.2 插件

除了以上的基本项外，webpack.config.js还支持插件plugins来完成一些loader完成不了的功能。

比如，配置OpenBrowserPlugin插件可以在构建完成之后自动在浏览器中打开"localhost:8080"，这样就不需要我们每次构建完后都要手动在浏览器中打开该地址来进行调试(请参考下面的构建和调试章节)。
``` js
var OpenBrowserPlugin = require('open-browser-webpack-plugin'); 
module.exports = { 
entry: './src/app.js',
 output: { path: './bin', filename: 'app.bundle.js', }, 
module: {
 loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }] },
 plugins: [ new OpenBrowserPlugin({ url: 'http://localhost:8080' }) ]
 }
```

# 2. Babel加载器如何支持es6和jsx

Babel是个比较大的课题，总的来说Babel是一个转换编译器，有了它我们可以轻松使用上es6的新特性，而不需要等到浏览器支持上。同时Babel也可以支持上reactjs的jsx格式文件的解析转换。为了支持上这些特性，我们的webpack.config.js的加载器应该写成以下的模式：
``` js 
module: {
 loaders: [{ test: /\.(js|jsx)$/, loader: 'babel', query: { presets:['es2015', 'react'] } }]
 },
```
加载器的其它配置项我们都有提及，这里额外的query存在的意义就是：
- **query**: 为加载器提供额外的配置选项我们这里的配置选项presets就是为了支持上:
- **'es2015'**: 为了支持es6新特性，暂时我们没有用到，但是在往下的学习过程中，我打算引入一些es6的特性，所以这里一并配置上。
- **'react'**: 为了支持上react的jsx。

# 3. 实战alt-tutorial的webpack配置文件编写

有了以上的知识点作为铺垫，那么我们的alt-tutorial项目的webpack.config.js配置文件也就跃然纸上了：
``` js
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var config = { 
 entry: [ path.resolve(__dirname, 'src/App.jsx'), ],
 output: { path: path.resolve(__dirname, 'build'), filename: 'bundle.js' }, 
 module: { loaders: [{ test: /\.(js|jsx)$/, loader: 'babel', query: { presets:[ 'react'] } }] }, 
plugins: [ new OpenBrowserPlugin({ url: 'http://localhost:8080' }) ]};module.exports = config;
```

# 4. 构建和调试

我们当前的alt-tutial项目的package.json中指定的构建工具用的还是browserify，所以我们需要将其改过来。
``` json 
"scripts": { "build": "browserify -t [reactify --es6] src/App.jsx > build/app.js", "start": "npm run build && open 'index.html' " },
```
webpack的build非常简单，只需要执行一个webpack命令就好了。
``` json 
"scripts": { "build": "webpack" },
```
但是构造好之后，我们还需要将相应的文件发布到一个http服务器上，然后再通过浏览器访问，这也甚是麻烦。幸好，我们有webpack-dev-server这个命令工具，在开发的时候其实我们只需要像上面的构建build调用webpack命令一样，我们可以在安装了webpack-dev-server的模块后，直接调用该命令来进行打包的同时，它还会以当前目录作为根目录启动一个基于express的http服务器，默认的监听端口就是8080。这样配合上面webpack.config.js的OpenBrowserPlugin插件，构建后的运行调试就方便多了。最终我们的package.json的scripts改成如下:
``` json 
"scripts": { "build": "webpack", "dev": "webpack-dev-server " },
```
当然，webpack-dev-server还支持很多其它的高级参数选项，但是作为初学者，本人就先不深究了。

# 5. 依赖包更新和运行

为了能让构建脚本跑起来，我们需要把我们的webpack工具，babel加载器，插件等其它的依赖包给安装上。这里本人就直接给出packge.json的配置，大家直接npm install就好了。
``` jason
{ 
"name": "alt-tutorial", 
"version": "1.0.0", 
"description": "A simple flux tutorial built with alt and react", 
"main": "App.jsx", 
"dependencies": { "alt": "^0.18.6", "alt-container": "^1.0.2", "alt-utils": "^1.0.0", "babel-core": "^6.14.0", "babel-loader": "^6.2.5", "babel-preset-es2015": "^6.14.0", "babel-preset-react": "^6.11.1", "open-browser-webpack-plugin": "0.0.2", "react": "^15.3.2", "react-addons-test-utils": "^15.3.2", "react-dom": "^15.3.2" }, 
"devDependencies": { "webpack": "^1.13.2", "webpack-dev-server": "^1.16.1" }, 
"scripts": { "build": "webpack", "dev": "webpack-dev-server " }, 
"author": "Josh Perez <josh@goatslacker.com>", 
"license": "MIT"}
```
最后执行以下命令就可以进行构建并在后台打开webpack-dev-server的同时在浏览器自动打开http://localhost:8080进行访问
``` bash
npm run dev
```

# 6. 源码获取

和上一篇的源码一样，本篇的改动都checkin到了github上面，感兴趣的可以通过以下github链接进行获取:https://github.com/kzlathander/alt-tutorial-webpack.gitclone下来后进入项目切换到02这个分支就可以进行构建:
``` bash
git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpackgit 
checkout 02
npm install 
npm run dev
```
最终运行结果如下：![运行结果](http://upload-images.jianshu.io/upload_images/264714-a3b8047ff74f7116?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 7. 运行

```bash
git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpack
git checkout 04
npm install
npm run dev
```

# 8. 下一篇文章计划

现在我们的alt-tutorial项目使用到的模块是最新的，构建的工具也已经使用上最火热的webpack，所以下一步我是准备走一遍这个项目的运行流程，通过代码阅读来学习一下reactjs和alt的相关知识点，同时也为往后的代码改造以及加入新功能做准备。至于这个过程需要一篇还是多篇文章才能cover完，现在就不得而知了，我们到时再看吧。敬请大家期待，也期待大牛的点评指点。


[第五章](https://github.com/zhubaitian/alt-tutorial-webpack/tree/05)
