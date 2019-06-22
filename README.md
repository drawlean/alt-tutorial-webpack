# 第三章 小白学react之打通React Component任督二脉

>天地会珠海分舵注:随着微信应用号的呼之欲出，相信新一轮的APP变革即将发生。作为行业内人士，我们很应该去拥抱这个趋势。这段时间在忙完工作之余准备储备一下这方面的知识点，以免将来被微信应用号的浪潮所淹没。

通过上一篇《[微信应用号开发知识贮备之Webpack实战](http://techgogogo.com/2016/09/webpack-in-action/)》，我们成功的将altjs官方实例教程alt-tutorials的打包工具从browserify切换到当前更火的更接近nodejs编写习惯的weback上来，并且在该过程中学习了webpack相关的基础知识，以便我们今后的扩展。从今天开始我的目标是通过对项目源码的分析，来学习reactjs和altjs相关的基础知识。

但是开始之前，希望大家先去看一下文章最后提及的准备知识，有了这样的基础我们再来看代码就事半功倍了。同时本文的原理之外的一些阐述会引用到这些文章，此处先对这些先行者道声感谢。今天的目标是分析AltContainer的实现原理，看它是如何将React Component组件的编程复杂度大幅度的降低，却大幅度的提升其代码的可复用性的。开始之前我们先看下alt和flux的一些基础知识。

# 1. flux 和 alt

根据[官网](https://facebook.github.io/flux/docs/overview.html)的描述，flux是facebook用来构建web前端应用的应用架构，它通过数据的单一方向流动，来对react组件式编程(React的view都是通过组件来组织起来的)进行一个补充。而事实上flux更像是一种设计模式(如mvc)，而非一个框架。
>Flux is the application architecture that Facebook uses for building client-side web applications. It complements React's composable view components by utilizing a unidirectional data flow. It's more of a pattern rather than a formal framework, and you can start using Flux immediately without a lot of new code.

所以围绕flux的这个设计模式，会有很多不同的实现。其中alt就是众多实现中的佼佼者。那么上面说的单一方向数据流动又是怎么回事呢？这里我们很有必要看下flux的一些基本概念。

## 1.1. 为什么我们需要flux
首先，为什么我们需要flux？根据Andrew Ray 的文章《[Flux For Stupid People](http://blog.andrewray.me/flux-for-stupid-people/)》的说法，那是因为javascript开发前端拥有着各种的库，什么angularjs，jquery，Backbone，但是，我们依然没有一个很好的框架能将数据流在项目中很好的组织起来，让我们以更好的方式进行开发。
>On the Front End™ (HTML, Javascript, CSS), we don't even have that. Instead we have a big problem: No one knows how to structure a Front End™ application. I've worked in this industry for years, and "best practices" are never taught. Instead, "libraries" are taught. jQuery? Angular? Backbone? The real problem, data flow, still eludes us.

作为一个新手，我在这里没有太多的发言权来评判究竟Andrew Ray的说法是否正确，期待有识之士在文章评论下面提出宝贵意见。暂时我先默认他的说法是对的。那么一言以蔽之，**flux就是为了更好的为web前端应用程序处理数据流而生的，且这些数据流都是单向流动的。**

## 1.2. 基本概念
![](http://upload-images.jianshu.io/upload_images/264714-09af9872d26d3e97?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
从官方提供的示意图来看，Flux将一个应用分成四个部分。
>**View**： 视图层，负责界面的呈现
**Action**：动作/命令，代表视图层发出的命令，一个Action其实就是一个javascript的对象，包含了命令和该命令携带的数据。比如点击某个按钮会触发mouseClick事件，在事件处理代码中我们可以触发一个action命令
**Dispatcher**：用来接收Actions，将 Action 派发到 Store。一个Dispatcher事实上就是一个事件系统，是Actions和Store之间的桥梁，将Actions作为事件广播出去，然后由注册了监听的对应Store接收处理。
**Store**：用来存放应用的状态，一旦发生变动，就提醒Views要更新页面

那么上面说的数据的单向流动又是怎么一回事呢？其实我们看上面的数据流向的箭头就明白了，数据都是单方向往下走的，由Dispatcher->Store->View->Action，再到Dispatcher，完成了一个不停循环的闭环。这样的话，数据流向就非常清晰，不会造成混乱。拿我们的alt-tutorial为例子：
![](http://upload-images.jianshu.io/upload_images/264714-4a8d64f9b66c781e?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)现实中的流程就是：
>1. 用户访问 View。比如我们点击alt-tutorial上面的favorite按钮
2. View 发出用户的 Action。比如点击favorite按钮后发送出一个添加收藏的地点(FavoriteLocation)的命令，命令中携带着该Location的数据，如名称和编号
3. Dispatcher 收到 Action，要求 Store 进行相应的更新。比如把收藏的地点作为一个state存储在内存中。
4. Store 更新后，发出一个"change"事件。
5. View 收到"change"事件后，更新页面。这时我们就能看到新增加的收藏地点显示在页面下方了。

再次强调，更具体的实例和描述，强烈建议大家查看文章后面的给出的文章链接，相信没有谁比他们写得更清楚的了，我自己就更不敢班门弄斧了！

## 1.3. alt 简介

alt就是flux的一种实现，所以上面flux的概念alt做了更高层的封装，以方便我们更方便的使用。比如，我们基本上不需要实现dispatcher相关的代码，因为alt已经帮我们封装起来，我们只需要根据其框架来填写对应的代码就完了。相信这系列往后的文章会逐一接触到alt的不同的特性，但

今天我们先解决alt的AltContainer这个特性。因为，只有弄清楚了它，我们才能真正明白原来有了alt之后，组件component的编写竟然能变得如此的简单。

# 2. AltContainer的目的和职责

根据上面flux的描述,在组件中应该去监听Store中state状态的改变。只要View触发一个Action, Dispatcher发现需要更新相应的Store的状态，然后就会通知相应的Store作状态的改变，同时通过Store通知View状态已经发生变化，View监听到后就会进行页面的重新渲染。我们打开src/components/Location.jsx文件，纵观整个组件文件，我们其实并没有看到任何监听相关的代码。
``` jsx
var React = require('react');
var AltContainer = require('alt-container');
var LocationStore = require('../stores/LocationStore');
var FavoritesStore = require('../stores/FavoritesStore');
var LocationActions = require('../actions/LocationActions');
var Favorites = React.createClass({ render() { return ( <ul> {this.props.locations.map((location, i) => { return ( <li key={i}>{location.name}</li> ); })} </ul> ); }});
var AllLocations = React.createClass({ 
addFave(ev) { var location = LocationStore.getLocation( Number(ev.target.getAttribute('data-id')) ); LocationActions.favoriteLocation(location); }, 

render() {
 if (this.props.errorMessage) { return ( <div>{this.props.errorMessage}</div> ); }
 if (LocationStore.isLoading()) { return ( <div> [站外图片上传中……(3)] </div> ) } return ( <ul> {this.props.locations.map((location, i) => { var faveButton = ( <button onClick={this.addFave} data-id={location.id}> Favorite </button> ); return ( <li key={i}> {location.name} {location.has_favorite ? '<3' : faveButton} </li> ); })} </ul> ); }});
var Locations = React.createClass({ 
  componentDidMount() { LocationStore.fetchLocations(); }, 
  render() { return ( <div> <h1>Locations</h1> <AltContainer store={LocationStore}> <AllLocations /> </AltContainer> <h1>Favorites</h1> <AltContainer store={FavoritesStore}> <Favorites /> </AltContainer> </div> ); }});

module.exports = Locations;
```

其实这里的玄机就是下面的AltContainer那段代码：
``` jsx 
<AltContainer store={LocationStore}> <AllLocations /> </AltContainer>
```
从这个写法我们可以知道，AltContainer就是React的一个组件，它有一个props 属性"store={LocationStore}"，且拥有一个子组件AllLocations，所以我们把AltContainer称作是一个容器。AllLocations这个子组件的主要作用就是从LocationStore中取出所有的Location然后进行渲染。
``` jsx 
render() { 
... 
return ( <ul> {this.props.locations.map((location, i) => { var faveButton = ( <button onClick={this.addFave} data-id={location.id}> Favorite </button> ); 
... })} </ul> ); 
}
```
但是从上面的代码我们可以看到，子组件明明是从自身的props属性中取得Locations，为什么说是从LocationStore中取得呢？况且LocationStore保存的是state而不是props啊？

答案还是AltContainer! 神奇吧！？

个人认为，AltContainer存在的主要目的主要是一个：- 通过职责的解绑，让Component的尽可能的关注在如何进行页面渲染的逻辑上去，而不需要去管该如何获取数据，该如何监听状态是否改变是否需要重新渲染的逻辑，从而让整个组件更容易重用！

因为AltContainer是作为Components的一个容器，一个父组件存在的。所以，只要你把一个只是包含渲染逻辑的组件丢给它，并告诉它需要监听的是哪个(些)Store(s)，它就能帮该子组件建立好对相应Store的监听，且把Store的状态数据告诉该子组件，让其进行界面的重新渲染。

所以，AltContainer的主要职责应该是两个: 
- 帮子组件建立对相应的Store的监听，以便Store状态state发生改变时，可以通知到该子组件进行重新渲染 
- 将Store的状态state数据取出来作为子组件的props，来让子组件知道应该去什么数据来进行界面渲染。这里因为子组件只是负责该如何渲染页面，而不需要对数据作任何修改(需要修改的话是通过发送Actions来做的)，所以这里用的是子组件的props，而不是state。

# 3. 源码分析-AltContainer原理

那么AltContainer是如何达成这两个职责的呢？我们不妨跟踪一下其实现源码，如果大家确实对其原理不是很感兴趣的，可以跳过这章。

## 3.1. AltContainer如何帮助子组件建立Store监听首先我们看下AltContainer是如何帮助子组件建立对Store的监听的。
``` js
_createClass(AltContainer, [
 ..., 
{ key: 'componentDidMount', value: function componentDidMount() { 
this._registerStores(this.props); 
if (this.props.onMount) this.props.onMount(this.props, this.context); } 
}, 
...
```

AltContainer作为我们的Component子组件AllLocations的父组件，在挂载完成时，会调用成员函数“this._registerStores(this.props)“。这里的this.props包含我们前面传入的LocationStore(this.props.store): 
``` jsx
<AltContainer store={LocationStore}>
```
那么往下我们看下_registerStores这个成员函数做了什么事情：
``` js
function _registerStores(props) { 
var _this2 = this; var stores = props.stores; 
if (props.store) { this._addSubscription(props.store); 
} ...
```

取出了我们传进去的LocationStore，然后作为参数调用另外一个成员函数_addSubscription。继续往下跟踪：
``` js
function _addSubscription(getStore) { 
var store = typeof getStore === 'function' ? getStore(this.props).store : getStore; 
this.storeListeners.push(store.listen(this.altSetState)); 
}
```
这个函数的第一句，首先去判断我们传进来的store是否是一个函数(注意altcontainer支持传进来的是funciton的，详情可以查看[AltContainer官方文档](http://alt.js.org/docs/components/altContainer/))，我们这里传进来的是LocationStore，是一个类(应该是类实例)，所以这里store变量被赋予的是getStore，在我们这里也就是LocationStore。

第二句就是我们这里的关键点，它首先是通过调用store.listen建立起对store的监听，一旦监听到store的状态发生变化，立刻调用一个叫做altSetState的成员进行处理。同时因为可能需要监听多个store，所以这里会将这些建立好的监听对象放到一个叫做storeListeners的栈中保存起来方便管理。到了这里，我们已经清楚AltContainer是如何帮助我们建立好对store的监听的。但是，我们至此只是知道监听到改动后会有一个altSetState的函数进行处理，且这个函数还是属于AltContainer这个类的，而不是子组件的。

所以现在我们依然不清楚当store状态发生变化时，时如何引发组件的数据发生变化，从而自动触发页面的重新渲染的。

那我们就需要继续跟踪altSetState这个方法了，且这一部分和我们刚才说到的AltContainer的第二个作用息息相关，关系到AltContainer是如何“将Store的状态state数据取出来作为子组件的props，来让子组件知道应该去什么数据来进行界面渲染。“

## 3.2. AltContainer如何将Store的state转换成AltContainer自己的state

那么我们先继续跟踪altSetState的源码：
``` js 
this.altSetState = function () { 
_this.setState(reduceState(_this.props)); };
```
很直接，内层函数调用reduceState方法来获取到相应的state，然后通过外层函数react的系统方法setState来将该state设置成AltContainer自身的state的成员变量。那么reduceState方法是从哪里取到的状态数据了，是不是就是从我们预期的store中呢？我们继续跟踪：
``` js
var reduceState = function reduceState(props) { 
return (0, 
  _objectAssign2['default'])({}, 
  getStateFromStores(props), getStateFromActions(props), 
  getInjected(props));
};
```
很幸运，我们看到返回的结果列表中，其中一个结果就是通过一个叫做getStateFromStores的函数返回的，顾名思义，这个应该就是我们要的结果。进去看看：
``` js
var getStateFromStores = function getStateFromStores(props) { 
var stores = props.stores; 
if (props.store) { return getStateFromStore(props.store, props); } 
else if (props.stores) { 
// If you pass in an array of stores then we are just listening to them 
// it should be an object then the state is added to the key specified 
if (!Array.isArray(stores)) { return Object.keys(stores).reduce(function (obj, key) { obj[key] = getStateFromStore(stores[key], props); return obj; }, {}); } } 
else { return {}; }};
```
这个函数可以处理单个store和多个stores的情况:
``` jsx
<AltContainer store={LocationStore}> <AllLocations /> </AltContainer>
```
以及可能的:
``` jsx
<AltContainer stores={{LocationStore：LocationStore, FavoriteStore: FavoriteStore}}> <AllLocations /> </AltContainer>
```
但在我们的alt-tutorial中，我们传进来的是第一种，所以，这里我们这里会直接调用getStateFromStore这个方法，其中传进去的第一个参数就是我们的store。
``` js
var getStateFromStore = function getStateFromStore(store, props) { return typeof store === 'function' ? store(props).value : store.getState();};
```
跟上面分析的一样，我们这里的store是一个类而非一个函数，所以这里返回的是store.getState(), 这里的store就是我们的LocationStore，getState函数返回的就是对应store的state。到了这里，我们弄清楚了AltContainer为子组件建立的store监听处理函数，在store数据状态发生改变时是如何处理的。结果就是将store的修改后状态state取出来，变成AltContainer自己的state！但是这里我们还有个问题没有搞清楚，AltContainer自己的state是如何变成子组件Component的props的？

## 3.3. AltContainer如何将自身的state转换成子组件的props

这里的关键就是AltContainer的渲染方法render。如上面所分析，AltContainer将store的数据变化进行监听，一旦发生改变，就会将store最新的数据从store拷贝到自己的state上面，从而导致自身的state发生变化，最终导致自身的重新渲染，也就是调用AltContainer自身的render方法：
``` js
unction render() { 
var _this3 = this; 
var Node = 'div'; 
var children = this.props.children;
 ... // Does not wrap child in a div if we don't have to.
 if (Array.isArray(children)) { ... })); } 
else if (children) { return _react2['default'].cloneElement(children, this.getProps()); }  ... } }]);
```
this.props.children是react组件的一个属性，代表的是组件的所有子节点。回顾下上面的代码：
``` jsx
<AltContainer store={LocationStore}> <AllLocations /> </AltContainer>
```
AltContainer是父组件，AllLocations是形成子节点的组件，所以这里的this.props.children指代的就是AllLocations.那么上面的代码的意思就是，如果AltContainer有这个子节点，那么就调用react的cloneElement这个方法来。看名称和参数的话，这个方法的作用应该就是将从getProps方法获得返回结果克隆到对应的子组件。我们首先看看AltContianer的getProps这个方法返回的是什么东东：
``` js
function getProps() { 
var flux = this.props.flux || this.context.flux; 
var transform = typeof this.props.transform === 'function' ? 
this.props.transform : id; return transform((0, _objectAssign2['default'])(flux ? { flux: flux } : {}, this.state)); }
```
从之前的分析可以看到，这里我们alt-tutorial传进来的props只有两个，一个是this.props.store(也就是我们LocationStore)，一个是this.props.children(也就是我们的AllLocations组件)，所以这里并没有this.props.flux和this.props.transform，我也没有看到在哪里有定义了this.context.flux，所以最后一句应该可以在我们的情况下简化为:
``` js
function getProps() { 
return id((0, _objectAssign2['default'])(this.state)); }
```
而这里的id只是将输入参数做简单的返回：
```js
var id = function id(it) { return it;};
```
所以最终geProps返回的结果就是AltContainer自身的this.state。那么我们继续分析上面的cloneElement方法：
``` js
ReactElement.cloneElement = function (element, config, children) { 
var propName; // Original props are copied 
var props = assign({}, element.props); ... // Remaining properties override existing props 
for (propName in config) { if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) { props[propName] = config[propName]; } } }
```
这里的第一个参数element指代的就是我们的AllLocation这个子组件，第二个参数config就是AltContainer的getProps方法的返回结果，也就是AltContainer的state。从未省略掉的代码看来的话，cloneElement的其中一个功能就是，AltContainer的state列表，然后将其拷贝到目标element(也就是我们这里的AllLocations)的props。到此，我们就分析完了AltContainer是如何将自己的state变成子组件的props的了。

# 3. 小结关于flux和alt:

- flux是一个为了解决javascript编写web前端的数据流控制的架构，存在多种不同的实现方式。
- alt是flux的一种实现。AltContainer存在的主要目的：
- 通过职责的解绑，让Component的尽可能的关注在如何进行页面渲染的逻辑上去，而不需要去管该如何获取数据，该如何监听状态是否改变是否需要重新渲染的逻辑，从而让整个组件更容易重用！因为AltContainer是作为Components的一个容器，一个父组件存在的。

AltContainer的主要职责:
- 帮子组件建立对相应的Store的监听，以便Store状态state发生改变时，可以通知到该子组件进行重新渲染
- 将Store的状态state数据取出来作为子组件的props，来让子组件知道应该去什么数据来进行界面渲染。这里因为子组件只是负责该如何渲染页面，而不需要对数据作任何修改(需要修改的话是通过发送Actions来做的)，所以这里用的是子组件的props，而不是state。

AltContainer原理简述:
- AltContainer通过将store的监听处理函数指定为自身的成员方法altSetState， 将store的state的改动，映射成AltContainer这个父组件自身的state的改动。所以一旦store的state改动，必然会触发AltContainer自身的重新渲染，从而调用自身的render方法。
- AltContainer通过React的cloneElement方法，将自身的state在每次AltContainer需要重新render时，复制到子组件的props上面。
- 所以，每次store的状态state有改动，就会导致AltContainer重新渲染，从而就会导致子组件的重新渲染，同时子组件可以通过自身的props获取到绑定的store的所有state。

## 4. 运行

```bash
git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpack
git checkout 03
npm install
npm run dev
```

# 5. 准备知识和鸣谢
---
如果对reactjs和flux的基本概念不清楚的，建议先查看以下文章：

- flux基本概念：请参考阮一峰的《[Flux 架构入门教程](http://www.ruanyifeng.com/blog/2016/01/flux.html)》和Andrew Ray 的文章《[Flux For Stupid People](http://blog.andrewray.me/flux-for-stupid-people/)》
- react基本概念：请参考阮一峰的《[React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)》

[第四章](https://github.com/zhubaitian/alt-tutorial-webpack/tree/04)
