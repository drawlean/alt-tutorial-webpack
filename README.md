# 第十二章 小白学react之调用微信jssdk实战


![封面.jpg](http://upload-images.jianshu.io/upload_images/264714-49abf54bff599805.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>  本打算网上找个react调用微信的jssdk的实例进行学习的，但可惜搜索了半天而未果，只有一些基于其他框架的。估计是大牛们都觉得太简单或者太忙了，懒得提笔花几个小时来给我们做个Demo。对于处于快速学习年代的我们，一个可以运行起来的示例是多么的重要。希望本示例可以起到抛砖引玉的作用，让大家能快速的在react框架下体验jssdk的强大功能。

通过上一篇《[小白学react之网页获取微信用户信息](http://techgogogo.com/2016/10/react_get_wechat_user_info/)》我们学习了如何通过获取扫码用户的微信基本信息并将其头像显示在页面的右上角。

本篇我们将会继续延续我们的alt-tutorial项目的实战计划，通过微信提供的jssdk库来获得微信更多高级的功能，比如调出摄像头进行扫码等。

最终的效果就是：

扫码后进入到微信sdk demo页面：

![Demo_Page.jpeg](http://upload-images.jianshu.io/upload_images/264714-1480ce1bfabfe333.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击第一个按钮，扫一个你手边的二维码，会自动进入到对应页面:

![ScanQRCode0.jpeg](http://upload-images.jianshu.io/upload_images/264714-9fa5fb0109466435.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击第二个按钮，扫一个你手边的二维码，不回自动进入任何页面，而是将解析后的信息返回来给应用自行处理：

![ScanQRCode1.jpeg](http://upload-images.jianshu.io/upload_images/264714-b7ee24e56cf25fb7.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 1. 微信JSSDK使用步骤简介

我们既然是在做基于微信的开发，当然就离不开微信的开发文档了。开始之前希望大家能先去看下《[微信JS-SDK说明文档](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html)》。那么我们怎么样才能用上微信的JSSDK呢？以下基本步骤就是基于该文档的。

需要注意的是，如果本人下面的描述你看的有点云里雾里的话，我建议你：

- 回头看下本系列《[小白学react](http://techgogogo.com/?s=react)》的历史基础文章，特别是《[小白学react之altjs的Action和Store](http://techgogogo.com/2016/09/altjs_action_store/)》以及《[小白学react之打通React Component任督二脉](http://techgogogo.com/2016/09/altcontainer/)》，或/和：
- 直接跳过我的描述，在文章后面下载最新的源码，先阅读源码，碰到问题再反过来看文章的描述。

**步骤一：绑定域名**

>先登录[微信公众平台](http://mp.weixin.qq.com/)进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
备注：登录后可在“开发者中心”查看对应的接口权限。

这里绑定的时候需要注意不要带前面的http协议头。写法跟上一篇《[小白学react之网页获取微信用户信息](http://techgogogo.com/2016/10/react_get_wechat_user_info/)》中的网页回调域名设置的写法是一样的。

**步骤二：引入JS文件**

>在需要调用JS接口的页面引入如下JS文件，（支持https）：
[http://res.wx.qq.com/open/js/jweixin-1.0.0.js](http://res.wx.qq.com/open/js/jweixin-1.0.0.js)
请注意，如果你的页面启用了https，务必引入 ：
[https://res.wx.qq.com/open/js/jweixin-1.0.0.js](https://res.wx.qq.com/open/js/jweixin-1.0.0.js) ，否则将无法在iOS9.0以上系统中成功使用JSSDK

因为我们的index.html是通过ejs模版生成的，所以我们只需要在我们的index.ejs中的body部分末尾加入相应的微信jssdk库的引用就好了。

``` ejs
    <% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
      <script src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
      <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <% } %>
```

**步骤三：通过config接口注入权限验证配置**

>所有需要使用JS-SDK的页面必须先注入配置信息，否则将无法调用（同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用,目前Android微信客户端不支持pushState的H5新特性，所以使用pushState来实现web app的页面会导致签名失败，此问题会在Android6.2中修复）。

``` js
wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见附录1
    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
```

这一步的关键是如何生成正确的签名。这里微信jssdk文档中有给出不同语言版本的签名算法示例大家可以参考。往下我们也会就github上的一个签名算法的封装进行学习。

在我们的实战过程中，签名会在服务器端发生。

react客户端会像之前的获取微信用户信息一样，通过一个restfulApi调用服务器端的api，然后由服务器来生成对应的签名，然后将签名信息返回给客户端。

客户端获取到上面wx.config示例代码中的签名相关信息后，就会调用一个Alt的Action，来触发将获取回来的信息保存到一个跟该Action绑定的jssdk状态管理的Store里面。然后就可以调用wx.config来配置我们需要用到的JS接口列表了。

注意这里的wx这个对象是通过上一步的JS文件引入进来的。我们在react的客户端代码中可以直接通过window.wx对其进行引用：

``` js
window.wx.config({
  ...
});
```

**步骤四：通过ready接口处理成功验证**

``` js
wx.ready(function(){

    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
});
```

随后，react客户端负责jssdk状态管理的store会调用wx.ready来监听config配置是否成功，如果成功的话，就会将该store的一个ready状态设置成true。

这样的话，通过AltContainer绑定了该store的相应的Component组件就能知道响应的jssdk的api是否已经准备就绪，可以进行调用了。


**步骤五：通过error接口处理失败验证**

``` js
wx.error(function(res){

    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

});
```

同理，如果如果配置失败的话，那么就在wx.error这个监听接口中将ready状态设置成false。

#### 2. 生成签名

如前面所述，我们需要用到jssdk的页面必须要要注入调用到的api的配置信息。

``` js
wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见附录1
    jsApiList: [] // 必填，需要使用的JS接口列表
```
而注入JS接口到页面时，我们可以看到，还需要使用到其他一些信息。其中appId我们可以从公众号管理后台获得。signature是跟所访问页面的url关联的一个签名，它有专门的一套算法来生成。另外两个参数nonceStr和signature都是在签名的过程中生成的。

这里通过wx.config传进去这些参数，主要是为了让微信去判断我们生成的签名和微信通过这些信息生成的签名是否一致，如果不一致的话，那么注入到该页面的jsApiListj就失败。

那么我们在服务器这边的签名算法是如何的呢？根据微信开发文档我们需要提供以下4个参数，然后通过sha1算发来生成对应的签名：
- noncestr：一个随机字符串，我们随便填写
- jsapi_ticket：jsapi_ticket是公众号用于调用微信JS接口的临时票据
- timestamp: 签名时间戳。注意这个时间戳需要和上面传入wx.config的时间戳一致
- url: 调用JS接口页面的完整URL。我们可以从react客户端通过location.href获得，并传给服务器端

那么这里主要需要解决的就是如何获得jsapi_ticket这个临时票据了。

根据文档的描述，我们可以通过以下这个接口获得：

> https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi

从中可以看到，我们调用这个接口首先要获得一个access_token。这里微信也有相应的api来处理。

>https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET

这里需要用到我们的微信公众号的appId和secret，这些我们都是已知的，所以好办。

那么，也就是说，我们其实只需要提供我们的微信公众号的appId和secret，就能获取到access_token，从而就会获得我们需要的jsapi_ticket。

这里我们参考下github上一个示例(https://github.com/liaobin312716/wechat-sdk-demo )的签名的实现。其传入的参数有两个，其中:

- url:  react客户端传进来的需要注入jsapi的页面url
- callback: 一个回调函数，接受一个json格式的参数。主要是用来将生成的签名信息等回传给上层调用函数。

``` js

const config = {
	grant_type: 'client_credential',
	appid: 'xxxx',
	secret: "xxxxx",
	noncestr:'Wm3WZYTPz0wzccnW',
	accessTokenUrl:'https://api.weixin.qq.com/cgi-bin/token',
	ticketUrl:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
}

exports.sign = function (url,callback) {
  var noncestr = config.noncestr,
		timestamp = Math.floor(Date.now()/1000), //精确到秒
	...
		request(config.accessTokenUrl + '?grant_type=' + config.grant_type + '&appid=' + config.appid + '&secret=' + config.secret ,function(error, response, body){
			if (!error && response.statusCode == 200) {
				var tokenMap = JSON.parse(body);
				request(config.ticketUrl + '?access_token=' + tokenMap.access_token + '&type=jsapi', function(error, resp, json){
					if (!error && response.statusCode == 200) {
						var ticketMap = JSON.parse(json);
						cache.put('ticket',ticketMap.ticket,config.cache_duration);  //加入缓存
						callback({
							noncestr:noncestr,
							timestamp:timestamp,
							url:url,
							jsapi_ticket:ticketMap.ticket,
							signature:sha1('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
						});
					}
				})
			}
		})
	}
}
```

这里的流程和我们刚才描述的并无二致。首先是通过appId和secret获得调用获取jsapi_ticket的access_token，然后通过该access_token获得我们签名需要用到的jsapi_ticket。noncestr我们是提前随便填写好的。timestamp的算法也比较简单。

最后就是通过sha1这个库提供的方法，将jsapi_ticket，noncestr，timestamp和页面url进行sha1签名，然后将以上这些信息通过callback返回给上层调用函数。

那么我们往下看下我们的上层调用函数。其实就是我们的express路由:

``` js
app.get("/api/signature", function(req,res) {

    const url = req.query.url.split('#')[0];

    signature.sign(url,function(signatureMap){
        signatureMap.appId = wechat_cfg.appid;
        res.send(signatureMap);
    });

})
```
根据微信开发文档需求，我们首先需要将传进来的url的锚点后面的数据给去掉，保留前面的有效部分。

然后就是调用上面的sign方法来生成签名。上面的签名方法最后传进来的json数据就是这里的signatureMap。我们最终会将这些数据发送回react客户端。

同时，通过上面的wx.config的示例，我们知道还需要用到微信公众号的appId。所以这里一并将其放到signatureMap中进行返回。

那么到此为止，react客户端调用服务端的"/api/signature"返回的数据示例如下:

``` json
{ 
  noncestr: 'Wm3WZYTPz0wzccnW',
  timestamp: 1476873698,
  url: 'http://techgogogo.ittun.com/?code=001kGsd30xcm7F1PAFf305Uud30kGsdr&state=',
  jsapi_ticket: 'sM4AOVdWfPE4DxkXGEs8VBqyVbs-TKGYp4d_ZSQa0Q5WvvMUPNQ6XGpyEcgKOD_xID_GrMCaalSmIF9JbrGaOg',
  signature: '9268ffaf4b9eb0d296fcfefe3d2724118aa05e3c' 
}
```

#### 3.  客户端获取签名信息

##### 3.1 获取签名信息并注入jssdk

和之前的获取微信用户信息一样，我们这里会建立一个新的Source文件WechatSdkSource.js来调用远程服务器的"/api/signature"接口:

``` js
var WechatSdkSource = {
  fetchSignatureMap() {
    return {
      remote(state,url) {
        return co(function *() {
          let signatureMap = null;
          const getSignatureMapUrl = `/api/signature`;
          try {
            let result = yield request.get(getSignatureMapUrl).query({url:url});
            signatureMap = result.body;
          } catch (e) {
            signatureMap = null;
          }
          //console.log("userInfo:", userInfo);
          return signatureMap;
        });
      },

      local() {
        // Never check locally, always fetch remotely.
        return null;
      },

      success: WechatSdkActions.updateSignatureMap,
      error: WechatSdkActions.getSignatureMapFailed,
      loading: WechatSdkActions.getSignatureMap,
    }
  }
};

```
这里传进来的url由下面将要谈及的上层函数所生成。整个流程就没有什么好说的了，说白了就是通过相应的库发送一个带有url的query参数的请求到服务器端来请求签名信息，相信有跟着这个系列文章的朋友都是很清楚的了。

最终请求成功返回的时候就会调用WechatSdkActions的updateSignatureMap这个Action。

``` js

var alt = require('../alt');

module.exports  = alt.generateActions(
    'updateSignatureMap',
    'getSignatureMap',
    'getSignatureMapFailed',
);

```

而这个action就会触发所监听的WechatSdkStore的onUpdateSignatureMap这个回调。

``` js
class WechatSdkStore {
  constructor() {
    this.signatureMap = [];
    this.errorMessage = null;
    this.ready = false;

    this.bindActions(WechatSdkActions);

    this.exportAsync(WechatSdkSource);

  }

  onUpdateSignatureMap(signatureMap) {
    this.signatureMap = signatureMap;
    this.errorMessage = null;

    let weChatState = {
      debug: false,
      appId: this.signatureMap.appId,
      timestamp: this.signatureMap.timestamp,
      nonceStr: this.signatureMap.noncestr,
      signature: this.signatureMap.signature,
      jsApiList: [
        'scanQRCode',
        'chooseWXPay',
      ]
    }

    window.wx.config(weChatState);

    window.wx.ready(() => {
      this.ready = true;
    });

    window.wx.error((err) => {
      this.ready = false;
      console.error('upload/UploadContainer/wx/wxError')
      console.error(JSON.stringify(err))
    });
    
  }

  onGetSignatureMapFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }

  onGetSignatureMap() {
    return this.signatureMap = [];
  }

}

module.exports = alt.createStore(WechatSdkStore, 'WechatSdkStore');

```

在onUpdateSignatureMap中，所做的事情就是我们在第一段中描述的微信JSSDK使用不中的中第3，4，5步所做的事情了:

- 步骤三：通过config接口注入权限验证配置。里面用到的签名参数我们都可以通过刚才从服务器返回来的signatureMap获得。
- 步骤四：通过ready接口处理成功验证。将ready设置成true，到时页面会判断jssdk是否已经准备就绪。
- 步骤五：通过error接口处理失败验证。将ready设置成false，到时页面会判断jssdk是否还没有准备好。



##### 3.2. 进入根路由时获取页面url

根据微信开发文档，每个页面url我们只需要调用一次jssdk的配置注入方法就可以了。因为我们是单页面应用，所以我们每个内部页面的url都是一样的。

所以，我们这里只需要在进入根路由的时候调用一次WechatSdkSource的fetchSignatureMap方法来从服务器端获取到签名就好了。因为签名返回时会自动触发我们的updateSignatureMap这个Action，而这个Action又会自动触发onUpdateSignatureMap这个回调。最后这个回调里面就会执行上面的页面jssdk注入和注入结果监听流程。

那么我们最终的路由就改成:

``` js
class RootRouters extends Component {

    wechatAuth(nextState, replace, next) {

        const uri = new URI(document.location.href);
        const query = uri.query(true);
        const {code} = query;

        if(code) {
            WechatUserStore.fetchUserInfo(code);
            WechatSdkStore.fetchSignatureMap(location.href);
            next();

        } else {

            document.location = generateGetCodeUrl(document.location.href);
        }

    }

    configWx(nextState, replace, next) {

        //WechatSdkStore.fetchSignatureMap(location.href);
        next();

    }

    //onEnter={this.wechatAuth.bind(this)}
    render() {
        const { history } = this.props;
        return (
            <Router history = {history} >
                <Route name='index' path ="/" onEnter={this.wechatAuth.bind(this)} component={Home} >
                    <IndexRoute component={About}/>
                    <Route name="about" path ="/about" component={About} />
                    <Route name="wechatsdk" path ="/wechatsdk" onChange={this.configWx.bind(this)} component={WechatSdk}/>
                    <Route name="locations" path ="/locations" component={Locations} />
                </Route>
            </Router>
        );
    }
```

和获取微信用户信息的时候一样，在进入根路由的时候就会去调用wechatAuth这个方法，然后就会去服务器端获取微信用户信息和注入jssdk所需要的签名信息。

wechatAuth这个方法现在是担任了两个职责，根据编程原则SRP单一职责原则的话，这肯定是不好的了。但因为这里代码不多，且只是demo用的，我就不做重构了。

#### 4. jssdk调用

因为我们需要将WechatSdkStore的成员变量自动转换成页面的state以及让页面监听这些state的变化，所以这里我们还是一如既往的用上AltContainer控件:

``` js
class WechatSdk extends React.Component{

    render() {

        return (
            <BaseLayout title="WechatSdk" style={{"backgroundColor": "white"}}>

                <AltContainer store={WechatSdkStore}>
                    <Content/>
                </AltContainer>
            </BaseLayout>
        )
    }
}

module.exports = WechatSdk;
```

然后我们在content子控件中实现我们的页面逻辑。页面逻辑非常简单，就是显示两个按钮，然后调用jssdk的两个api来打开摄像头进行扫码。

- 其中第一个按钮调用的api在扫码后，微信会自动进行处理，比如跳转到该二维码指定的url页面。
- 第二个按钮用的api在扫码后，微信不回自动处理，会把解析后的二维码信息返回来，然后让用户自行处理。

两个按钮的实现如下:

``` js
<Button  className="wechatsdk__btn" onClick={this.onScanQRCode0.bind(this)}>scanQRCode(微信处理结果)</Button>
<Button  className="wechatsdk__btn" onClick={this.onScanQRCode1.bind(this)}>scanQRCode(直接返回结果)</Button>
```

两个按钮在惦记后就会分别调用以下的两个方法，然后出发对应的jssdk api来进行工作:

``` js
onScanQRCode0() {
        if(this.props.ready) {
            wx.scanQRCode({
                desc: 'scanQRCode desc'
            });
        } else {
            alert("Wechat jssdk is not ready! Please check whether wx.config was called correctly");
        }
    };

    onScanQRCode1() {

        if(this.props.ready) {
            wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        } else {
            alert("Wechat jssdk is not ready! Please check whether wx.config was called correctly");
        }
    };
```

jssdk的api格式都是固定的，要填写什么项，成功的时候调用success，cancel的时候调用cancel，等等，都在《[微信JS-SDK说明文档](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html)》中有说明，大家照着上面的需求填写就好了。

这里主要想说下的是两个函数中前面的对this.props.ready的判断，其实这个ready就是我们上面说的WechatSdkStore的那个成员属性。如果前面的jssdk注入成功的话，ready就是true，否则就是false。

如果成功注入，那么代码就会正常去调用jssdk的相应api，入则就提示用户该jssdk没有注入成功。


#### 5. 源码

> git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpack
checkout 10
npm install
npm run build
babel-node src/server/server.js

因为我们现在的server端代码也慢慢增多了，所以我将代码结构调整了下，将原来所有客户端的文件都移到了新增的src/app下面，并且新增src/server文件夹来存放服务端的文件。
