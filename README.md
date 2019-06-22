#  第八章 小白学react之页面BaseLayout框架及微信的坑

>*天地会珠海分舵注:随着微信应用号的呼之欲出，相信新一轮的APP变革即将发生。作为行业内人士，我们很应该去拥抱这个趋势。其中Reactjs相信是开发webapp的佼佼者，这段时间将会通过改造官方实例alt-tutorial来学习Reactjs相关的知识。*

上一篇《[小白学react之SASS实战](http://techgogogo.com/2016/10/react_sass/)》我们学习了如何通过运用sass来为我们的应用页面“上色”，加入css的支持。

但是我们到现在为止，每个页面的标题还是系统默认的，这多多少少显得不专业：


![no_title.jpg](http://upload-images.jianshu.io/upload_images/264714-5355f65236b1c719.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


今天我的目标就是为所有页面提供一个通用的基础布局框架，以便在同一个地方控制不同页面的布局，比如背景颜色以及标题等。

### 1. BaseLayout

#### 1.1 小白方案
以修改标题为例，假如我们希望在About页面的时候标题显示的是About，在Locations页面的时候标题显示的是Locations。那么，作为小白，我首先想到的办法就是在About.jsx和Locations.jsx页面文件各自的render方法中进行标题的修改。 

About.jsx加入document.title="About"行:

``` jsx
var About = React.createClass({

  render() {
      document.title = "About";
      return (
          <div>
            <h2>Techgogogo</h2>
              他山之石，可以攻玉。主要分享海外最实用的创业，产品，创意，科技，技术等原创原译文章，以助你事业路上一路飞翔！虎嗅，搜狐自媒体，36氪，人人都是产品经理，经理人分享等媒体撰稿人。但，这里才是我们的大本营！
          </div>
      )
  }
})

```

Locations.jsx加入docuemnt.title = "Locations"行:

``` jsx
  render() {
    document.title = "Locations";
    return (
            <div>
              <h1 className="locations__table--head">Locations</h1>
              <AltContainer store={LocationStore}>
                <AllLocations />
              </AltContainer>

              <h1 className="locations__table--head">Favorites</h1>
              <AltContainer store={FavoritesStore}>
                <Favorites />
              </AltContainer>
            </div>
    );
  }
});
```

最终我们看到的结果就是:


![about_title.png](http://upload-images.jianshu.io/upload_images/264714-3167d07902ba6b88.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![locations_title.png](http://upload-images.jianshu.io/upload_images/264714-f07b407f2af60f96.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

进入两个页面都能正确的将title显示出来。

但是这种实现方式有个问题，代码重复。现在只是修改一个title，代码量不大，但是一旦我们的逻辑变复杂了，或者页面变多了，那么维护起来就比较头痛了。

那么，有没有更通用点的做法呢？

#### 1.2. react组件嵌套和面向对象中的继承

一提到“通用”和“公用”这些词眼，熟悉面向对象编程思想的童鞋肯定第一时间想到了面向对象中的继承这个特性。也就是父类提供基础的所有子类共有的方法和特性，子类通过继承而扩展自有的功能。然后子类在实例化的时候会先调用父类的构造函数，然后才到自身的构造函数。

其实我个人觉得react中的组件嵌套的理念，跟面向对象中的继承有相似之处。代表不同页面的子组件嵌套在同一个父组件里面，当子组件需要在全局页面布局上设置一些特定的效果的时候，就将这些预期效果作为props传给父组件，由父组件统一进行处理。

比如我们可以提供一个这样的BaseLayout父组件:

``` jsx
class BaseLayout extends React.Component {

  render() {
    let title = this.props.title;
    document.title = title;
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
```
然后将About子组件嵌套在这个父组件里面，且将相应的title作为props传给父组件：

``` jsx
  render() {
      return (
        <BaseLayout title="About">
          <div>
            <h2>Techgogogo</h2>
              他山之石，可以攻玉。主要分享海外最实用的创业，产品，创意，科技，技术等原创原译文章，以助你事业路上一路飞翔！虎嗅，搜狐自媒体，36氪，人人都是产品经理，经理人分享等媒体撰稿人。但，这里才是我们的大本营！
          </div>
        </BaseLayout>
      )
  }
})
```

同样，将Locations子组件嵌套在这个父组件里面，且将相应的title作为props传给父组件:

``` jsx
  render() {
    return (
        <BaseLayout title="Locations" >
            <div>
              <h1 className="locations__table--head">Locations</h1>
              <AltContainer store={LocationStore}>
                <AllLocations />
              </AltContainer>

              <h1 className="locations__table--head">Favorites</h1>
              <AltContainer store={FavoritesStore}>
                <Favorites />
              </AltContainer>
            </div>
        </BaseLayout>
    );
  }
```

通过以上的实现，我们同样可以获得跟上面一样的显示效果，且这样做的话我们的代码就更容易维护了，因为显示的逻辑代码都集中在一个地方了(虽然这里只有简单的修改title代码)。

#### 1.3. 代码可扩展性和OCP原则

如果大家有关注我们这个系列文章的前几篇的话，应该很清楚我们当时在加入嵌套路由之后，整个alt-tutorial-webpack应用的组件布局是这样的:

``` jsx
<Home>
  <About />
  <Locations />
</Home
```

那么如果我现在将需求改一改，需要将每个页面的title用页面层级的方式显示出来。比如，需求变成：
- About页面的title变成"Home>About>"
- Locations页面的title变成“Home>Locations>"

那我们应该如何处理呢？

当然，我们第一反应应该就是将About页面的传进来的Title改成"Home>About>"， 将Home页面传进来的Title改成"Home>Locations>"。但是这样hardcode方式的绑定是非常不易与代码的扩展的。

比如，如果后面因为功能的改变，需要在Home页面下再套一层叫做通用页面的层，那么整个布局就变成：

``` jsx 
<Home>
	<General>
  		<About />
  		<Locations />
	</General>
</Home>
```

那么按照刚才的需求，最终的About页面的title就应该变成："Home-General-Locations"，那这个时候我们就需要去修改之前hardcoded的代码了。

所以我们的代码的可维护性和可扩展性就变得非常的差，也即是违反了编程原则中很重要的一条原则，即OCP开闭原则：

> 编程原则之OCP原则：我们的代码应该对扩展开放，对修改关闭。

那么我们是否有其他方案来处理这种需求呢？

#### 1.4. 符合OCP原则的解决方案

面对这种需求，我们心里应该会想，如果我们在BaseLayout中能拿到所有层级传进来的props的话，那么我们把Home页面也嵌入到BaseLayout里面，并同时将自己的Title传进来，那么再由BaseLayout来进行各个层级的组件的Title的组合，那么问题不就解决了吗？

这样的话，每个层级的组件只需要将自己的title给传给BaseLayout，那么无论你今后页面层次架构如何改变，我现有的代码都不需要改动，这就满足了OCP中的对修改关闭的原则；同时，一旦加入新的层级，我们只需要依葫芦画瓢的将该层级的title作为propos传进来给BaseLayout就行了，这就是OCP中的对扩展开放的原则。

其实我们要相信我们并不是第一个碰到这种需求的人，往往我们碰到问题时，别人都已经提供出解决方案了。

如我们现在的这个问题，已经有先行者为我们提供了一个叫做"react-side-effect"的包来解决了。详情大家可以到[官网](https://github.com/gaearon/react-side-effect) 进行了解。
 
个人理解这个模块提供的主要功能就是：

- 当用户进入某个页面，比如Home->About时，该模块会依次将Home和About传进来的props给push到一个列表里面保存起来。当然，这里前提是Home和About页面外层都包装了添加了react-side-effect特性的BaseLayout组件。
- 然后会触发一个emitChange事件，当eact-side-effect监听到这个事件的时候，就会开始调用下面提及的两个回调函数。

这个模块主要为我们提供了两个回调方法：

- reducePropsToState: 每当子组件需要重新挂载或者子组件传进来的props发生变化时，都会调用这个回调方法，且会将子组件的组件树中的所有props当作参数传进来。我们可以在这个回调方法中将props进行整合，然后return回去。return回去的参数将自动作为BaseLayout的state。比如我们进入Home->About页面时，系统会先尝试挂载Home页面，这时会用Home传进来的props作为参数调用一次reducePropsToState；然后会尝试挂载About页面，这时会将Home和About页面传进来的props作为参数再调用一次reducePropsToState。
- handleStateChangeOnClient：reducePropsToState返回时就会触发这个回调函数，且这个回调函数接收的参数就是reducePropsToState的返回值。所以我们可以在这个回调函数里面修改整个Document的title和backgroundColor。

我们在BaseLayout中import进“react-side-effect“模块，并增加reduceProsToState回调方法如下:

``` jsx
import withSideEffect from 'react-side-effect';
...
const reducePropsToState = (propsList) => {
    const style = {};
    let title = '';

    propsList.forEach(function (prop) {
        title += prop.title;
        title += ">";
    });

    return {title};
}
```

同时增加handleStateChangeOnClient回调函数的代码：

``` jsx
function handleStateChangeOnClient(title) {
  document.title = title || '';
}
```

然后将BaseLayout加入side effect特性后返回：

``` jsx
export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(BaseLayout);
```

这时显示效果如下：

![ocp_solution_about.png](http://upload-images.jianshu.io/upload_images/264714-c033a4c4f535f26d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![ocp_solution_locations.png](http://upload-images.jianshu.io/upload_images/264714-04d9245204dee1f9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

当然，这时如果不把Locations页面和About页面嵌入到BaseLayout里面的话，最终两个页面显示的title都会是"Home>"。因为，比如在进入Home->Locations页面的时候的流程是:

- 挂载Home页面时将携带title="Home"的props传入到BaseLayout
- withSideEffect监听到Home传进来的Props更新
- 调用回调函数reducePropsToState将title整理成"Home>",
- 调用回到函数handleStateChangeOnClient来将title设置到document.title上面
- 这次因为Locations页面没有嵌套BaseLayout层，所以整个流程就到此终结。

所以这种情况下的效果就是所有页面共用Home的Title：

![about_share_home_title.png](http://upload-images.jianshu.io/upload_images/264714-3eac1bdeb70e8746.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![locations_share_home_title.png](http://upload-images.jianshu.io/upload_images/264714-88d1e74d7db4df07.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 #### 1.5. 微信的坑

以上修改我们在chrome浏览器调试是完全没有问题的，但是我们如果在微信上跑的话，问题就会来了。

在微信运行之前，我们需要先让webpack-dev-server支持上通过ip访问调试服务器的8080端口，需要做的事情其实就是在package.json中的webpack-dev-server运行命令中加一个参数"--host 0.0.0.0"。

重新运行:

``` bash 
npm run dev
```

这时再在微信中通过ip访问调试机器的8080端口，这时我们会看到无论是进入Locations还是About页面，Title都是没有变化的。

![wechat_about_no_change.jpg](http://upload-images.jianshu.io/upload_images/264714-8eb0f2be054b3483.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![wechat_locations_no_change.jpg](http://upload-images.jianshu.io/upload_images/264714-ba90bf26ece68a68.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

谷歌一番之后，据说这是微信本身的一个坑：
> 单页应用里整个页面只会在第一次完全刷新，后面只会局部刷新（一般不包括head及里面的title），所以无法在服务器端控制title，只能在页面刷新的时候通过js修改title。常规做法如下，可惜在iOS微信浏览器无效。

网上也给出了相应的解决方案，在设置title之后加入如下代码:

``` jsx
    const iframe = document.createElement('iframe');
    iframe.src = 'logo.png';
      iframe.style.visibility = 'hidden';
      iframe.style.width = '1px';
      iframe.style.height = '1px';

      const listener = () => {
      setTimeout(() => {
        iframe.removeEventListener('load', listener);
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 0);
      }, 0);
    };
    iframe.addEventListener('load', listener);
    document.body.appendChild(iframe);

```

原理是：

> 出问题是因为微信浏览器首次加载页面初始化title后，就再也不监听 document.title的change事件。而这里修改title之后，给页面加上一个内容为空的iframe，随后立即删除这个iframe，这时候会刷新title。

修改之后我们的微信就能正常支持上了。同时，我们除了可以往BaseLayout中传入title来修改各个页面的document.title之外，还能传入其他的Props，比如style和css的className等。大家可以checkout最新的代码进行参考。

### 2. 源码:

``` shell
git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpackgit
checkout 06
npm install
npm run dev
```

[第九章](https://github.com/zhubaitian/alt-tutorial-webpack/tree/07)
