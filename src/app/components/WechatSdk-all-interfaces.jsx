import React from 'react'
import { Link } from 'react-router'
import BaseLayout from "./BaseLayout.jsx";
var AltContainer = require('alt-container');
import WechatSdkStore from "../stores/WechatSdkStore";
import {Button,TextArea} from 'react-weui';
import "./WechatSdk.scss";

let count = 0;
class Content extends React.Component{

    constructor() {
        super();

        this.imageLocalIds = [];
        this.imageServerIds = [];
    };

    componentDidMount() {

        console.log("WechatSdks Content component did mount with props:",this.props);
        this.registerWxHandlers();
    };

    onChooseImages() {

        window.wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

            success: function (res) {
                console.log("res:",res);
                this.imageLocalIds = res.localIds;
                console.log("imageLocalIds:",this.imageLocalIds);
                alert('已选择 ' + res.localIds.length + ' 张图片');
            }
        });

        console.log("end of onChooseImage, imageLocalIds:",this.imageLocalIds);
    };

    onUploadImages() {

        console.log("imageLocalIds:",this.imageLocalIds);

        window.wx.uploadImage({

            localId: this.imageLocalIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                console.log("uploaded images res:",res);
                this.imageServerIds[0] = res.serverId; // 返回图片的服务器端ID
            }
        });

    };

    onPreviewImages() {

        wx.previewImage({
            current: 'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
            urls: [
                'http://img3.douban.com/view/photo/photo/public/p2152117150.jpg',
                'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
                'http://img3.douban.com/view/photo/photo/public/p2152134700.jpg'
            ]
        });

    };

  render() {

      console.log("WechatSdks Content with props:",this.props);


      if (WechatSdkStore.isLoading()) {
          return (
              <div>
                  <img src="ajax-loader.gif" />
              </div>
          )
      }

      return (
        <BaseLayout title="WechatSdk"  style={{"backgroundColor":"#6b6b6b"}}>
          <div  className="wechatsdk">
            <h3 id="menu-image">图像接口</h3>
            <Button id="chooseImage" className="wechatsdk__btn">选择图片</Button>
            <Button id="previewImage" className="wechatsdk__btn">预览图片</Button>
            <Button id="uploadImage" className="wechatsdk__btn">上传图片</Button>
            <Button id="downloadImage" className="wechatsdk__btn">downloadImage</Button>

            <h3 id="menu-basic">基础接口</h3>
            <Button id="checkJsApi" className="wechatsdk__btn">checkJsApi</Button>

            <h3 id="menu-share">分享接口</h3>
            <Button id="onMenuShareTimeline" className="wechatsdk__btn">onMenuShareTimeline</Button>
            <Button id="onMenuShareAppMessage" className="wechatsdk__btn">onMenuShareAppMessage</Button>
            <Button id="onMenuShareQQ" className="wechatsdk__btn">onMenuShareQQ</Button>
            <Button id="onMenuShareWeibo" className="wechatsdk__btn">onMenuShareWeibo</Button>

            <h3 id="menu-voice">音频接口</h3>

            <Button id="startRecord" className="wechatsdk__btn">startRecord</Button>
            <Button id="stopRecord" className="wechatsdk__btn">stopRecord</Button>
            <Button id="playVoice" className="wechatsdk__btn">playVoice</Button>
            <Button id="pauseVoice" className="wechatsdk__btn">pauseVoice</Button>
            <Button id="stopVoice" className="wechatsdk__btn">stopVoice</Button>
            <Button id="uploadVoice" className="wechatsdk__btn">uploadVoice</Button>
            <Button id="downloadVoice" className="wechatsdk__btn">downloadVoice</Button>

            <h3 id="menu-smart">智能接口</h3>
            <Button id="translateVoice" className="wechatsdk__btn">translateVoice</Button>

            <h3 id="menu-device">设备信息接口</h3>
            <Button id="getNetworkType" className="wechatsdk__btn">getNetworkType</Button>

            <h3 id="menu-location">地理位置接口</h3>
            <Button id="openLocation" className="wechatsdk__btn">openLocation</Button>
            <Button id="getLocation" className="wechatsdk__btn">getLocation</Button>

            <h3 id="menu-webview">界面操作接口</h3>
            <Button id="hideOptionMenu" className="wechatsdk__btn">hideOptionMenu</Button>
            <Button id="showOptionMenu" className="wechatsdk__btn">showOptionMenu</Button>
            <Button id="closeWindow" className="wechatsdk__btn">closeWindow</Button>
            <Button id="hideMenuItems" className="wechatsdk__btn">hideMenuItems</Button>
            <Button id="showMenuItems" className="wechatsdk__btn">showMenuItems</Button>
            <Button id="hideAllNonBaseMenuItem" className="wechatsdk__btn">hideAllNonBaseMenuItem</Button>
            <Button id="showAllNonBaseMenuItem" className="wechatsdk__btn">showAllNonBaseMenuItem</Button>

            <h3 id="menu-scan">微信扫一扫</h3>
            <Button id="scanQRCode0" className="wechatsdk__btn">scanQRCode(微信处理结果)</Button>
            <Button id="scanQRCode1" className="wechatsdk__btn">scanQRCode(直接返回结果)</Button>

            <h3 id="menu-shopping">微信小店接口</h3>
            <Button id="openProductSpecificView" className="wechatsdk__btn">openProductSpecificView</Button>

            <h3 id="menu-card">微信卡券接口</h3>
            <Button id="addCard" className="wechatsdk__btn">addCard</Button>
            <Button id="chooseCard" className="wechatsdk__btn">chooseCard</Button>
            <Button id="openCard" className="wechatsdk__btn">openCard</Button>

            <h3 id="menu-pay">微信支付接口</h3>
            <Button id="chooseWXPay" className="wechatsdk__btn">chooseWXPay</Button>

          </div>

        </BaseLayout>
      )
  }

    registerWxHandlers() {

        window.wx.ready(() => {
            // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
            document.querySelector('#checkJsApi').onclick = function () {
                wx.checkJsApi({
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'translateVoice',
                        'startRecord',
                        'stopRecord',
                        'onRecordEnd',
                        'playVoice',
                        'pauseVoice',
                        'stopVoice',
                        'uploadVoice',
                        'downloadVoice',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow',
                        'scanQRCode',
                        'chooseWXPay',
                        'openProductSpecificView',
                        'addCard',
                        'chooseCard',
                        'openCard'
                    ],
                    success: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            };

            // 2. 分享接口
            // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            document.querySelector('#onMenuShareAppMessage').onclick = function () {
                wx.onMenuShareAppMessage({
                    title: '互联网之子 方倍工作室',
                    desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
                    link: 'http://movie.douban.com/subject/25785114/',
                    imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
                    trigger: function (res) {
                        alert('用户点击发送给朋友');
                    },
                    success: function (res) {
                        alert('已分享');
                    },
                    cancel: function (res) {
                        alert('已取消');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                alert('已注册获取“发送给朋友”状态事件');
            };

            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            document.querySelector('#onMenuShareTimeline').onclick = function () {
                wx.onMenuShareTimeline({
                    title: '互联网之子 方倍工作室',
                    link: 'http://movie.douban.com/subject/25785114/',
                    imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
                    trigger: function (res) {
                        alert('用户点击分享到朋友圈');
                    },
                    success: function (res) {
                        alert('已分享');
                    },
                    cancel: function (res) {
                        alert('已取消');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                alert('已注册获取“分享到朋友圈”状态事件');
            };

            // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
            document.querySelector('#onMenuShareQQ').onclick = function () {
                wx.onMenuShareQQ({
                    title: '互联网之子 方倍工作室',
                    desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
                    link: 'http://movie.douban.com/subject/25785114/',
                    imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
                    trigger: function (res) {
                        alert('用户点击分享到QQ');
                    },
                    complete: function (res) {
                        alert(JSON.stringify(res));
                    },
                    success: function (res) {
                        alert('已分享');
                    },
                    cancel: function (res) {
                        alert('已取消');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                alert('已注册获取“分享到 QQ”状态事件');
            };

            // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
            document.querySelector('#onMenuShareWeibo').onclick = function () {
                wx.onMenuShareWeibo({
                    title: '互联网之子 方倍工作室',
                    desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
                    link: 'http://movie.douban.com/subject/25785114/',
                    imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
                    trigger: function (res) {
                        alert('用户点击分享到微博');
                    },
                    complete: function (res) {
                        alert(JSON.stringify(res));
                    },
                    success: function (res) {
                        alert('已分享');
                    },
                    cancel: function (res) {
                        alert('已取消');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                alert('已注册获取“分享到微博”状态事件');
            };


            // 3 智能接口
            var voice = {
                localId: '',
                serverId: ''
            };
            // 3.1 识别音频并返回识别结果
            document.querySelector('#translateVoice').onclick = function () {
                if (voice.localId == '') {
                    alert('请先使用 startRecord 接口录制一段声音');
                    return;
                }
                wx.translateVoice({
                    localId: voice.localId,
                    complete: function (res) {
                        if (res.hasOwnProperty('translateResult')) {
                            alert('识别结果：' + res.translateResult);
                        } else {
                            alert('无法识别');
                        }
                    }
                });
            };

            // 4 音频接口
            // 4.2 开始录音
            document.querySelector('#startRecord').onclick = function () {
                wx.startRecord({
                    cancel: function () {
                        alert('用户拒绝授权录音');
                    }
                });
            };

            // 4.3 停止录音
            document.querySelector('#stopRecord').onclick = function () {
                wx.stopRecord({
                    success: function (res) {
                        voice.localId = res.localId;
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            };

            // 4.4 监听录音自动停止
            wx.onVoiceRecordEnd({
                complete: function (res) {
                    voice.localId = res.localId;
                    alert('录音时间已超过一分钟');
                }
            });

            // 4.5 播放音频
            document.querySelector('#playVoice').onclick = function () {
                if (voice.localId == '') {
                    alert('请先使用 startRecord 接口录制一段声音');
                    return;
                }
                wx.playVoice({
                    localId: voice.localId
                });
            };

            // 4.6 暂停播放音频
            document.querySelector('#pauseVoice').onclick = function () {
                wx.pauseVoice({
                    localId: voice.localId
                });
            };

            // 4.7 停止播放音频
            document.querySelector('#stopVoice').onclick = function () {
                wx.stopVoice({
                    localId: voice.localId
                });
            };

            // 4.8 监听录音播放停止
            wx.onVoicePlayEnd({
                complete: function (res) {
                    alert('录音（' + res.localId + '）播放结束');
                }
            });

            // 4.8 上传语音
            document.querySelector('#uploadVoice').onclick = function () {
                if (voice.localId == '') {
                    alert('请先使用 startRecord 接口录制一段声音');
                    return;
                }
                wx.uploadVoice({
                    localId: voice.localId,
                    success: function (res) {
                        alert('上传语音成功，serverId 为' + res.serverId);
                        voice.serverId = res.serverId;
                    }
                });
            };

            // 4.9 下载语音
            document.querySelector('#downloadVoice').onclick = function () {
                if (voice.serverId == '') {
                    alert('请先使用 uploadVoice 上传声音');
                    return;
                }
                wx.downloadVoice({
                    serverId: voice.serverId,
                    success: function (res) {
                        alert('下载语音成功，localId 为' + res.localId);
                        voice.localId = res.localId;
                    }
                });
            };

            // 5 图片接口
            // 5.1 拍照、本地选图
            var images = {
                localId: [],
                serverId: []
            };


            document.querySelector('#chooseImage').onclick = function () {
                wx.chooseImage({
                    success: function (res) {
                        images.localId = res.localIds;
                        alert('已选择 ' + res.localIds.length + ' 张图片');
                    }
                });
            };


            // 5.2 图片预览
            document.querySelector('#previewImage').onclick = function () {
                wx.previewImage({
                    current: 'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
                    urls: [
                        'http://img3.douban.com/view/photo/photo/public/p2152117150.jpg',
                        'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
                        'http://img3.douban.com/view/photo/photo/public/p2152134700.jpg'
                    ]
                });
            };

            // 5.3 上传图片
            document.querySelector('#uploadImage').onclick = function () {
                if (images.localId.length == 0) {
                    alert('请先使用 chooseImage 接口选择图片');
                    return;
                }
                var i = 0, length = images.localId.length;
                images.serverId = [];
                function upload() {
                    wx.uploadImage({
                        localId: images.localId[i],
                        success: function (res) {
                            i++;
                            alert('已上传：' + i + '/' + length);
                            images.serverId.push(res.serverId);
                            if (i < length) {
                                upload();
                            }
                        },
                        fail: function (res) {
                            alert(JSON.stringify(res));
                        }
                    });
                }

                upload();
            };

            // 5.4 下载图片
            document.querySelector('#downloadImage').onclick = function () {
                if (images.serverId.length === 0) {
                    alert('请先使用 uploadImage 上传图片');
                    return;
                }
                var i = 0, length = images.serverId.length;
                images.localId = [];
                function download() {
                    wx.downloadImage({
                        serverId: images.serverId[i],
                        success: function (res) {
                            i++;
                            alert('已下载：' + i + '/' + length);
                            images.localId.push(res.localId);
                            if (i < length) {
                                download();
                            }
                        }
                    });
                }

                download();
            };

            // 6 设备信息接口
            // 6.1 获取当前网络状态
            document.querySelector('#getNetworkType').onclick = function () {
                wx.getNetworkType({
                    success: function (res) {
                        alert(res.networkType);
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            };

            // 8 界面操作接口
            // 8.1 隐藏右上角菜单
            document.querySelector('#hideOptionMenu').onclick = function () {
                wx.hideOptionMenu();
            };

            // 8.2 显示右上角菜单
            document.querySelector('#showOptionMenu').onclick = function () {
                wx.showOptionMenu();
            };

            // 8.3 批量隐藏菜单项
            document.querySelector('#hideMenuItems').onclick = function () {
                wx.hideMenuItems({
                    menuList: [
                        'menuItem:readMode', // 阅读模式
                        'menuItem:share:timeline', // 分享到朋友圈
                        'menuItem:copyUrl' // 复制链接
                    ],
                    success: function (res) {
                        alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            };

            // 8.4 批量显示菜单项
            document.querySelector('#showMenuItems').onclick = function () {
                wx.showMenuItems({
                    menuList: [
                        'menuItem:readMode', // 阅读模式
                        'menuItem:share:timeline', // 分享到朋友圈
                        'menuItem:copyUrl' // 复制链接
                    ],
                    success: function (res) {
                        alert('已显示“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            };

            // 8.5 隐藏所有非基本菜单项
            document.querySelector('#hideAllNonBaseMenuItem').onclick = function () {
                wx.hideAllNonBaseMenuItem({
                    success: function () {
                        alert('已隐藏所有非基本菜单项');
                    }
                });
            };

            // 8.6 显示所有被隐藏的非基本菜单项
            document.querySelector('#showAllNonBaseMenuItem').onclick = function () {
                wx.showAllNonBaseMenuItem({
                    success: function () {
                        alert('已显示所有非基本菜单项');
                    }
                });
            };

            // 8.7 关闭当前窗口
            document.querySelector('#closeWindow').onclick = function () {
                wx.closeWindow();
            };

            // 9 微信原生接口
            // 9.1.1 扫描二维码并返回结果
            document.querySelector('#scanQRCode0').onclick = function () {
                wx.scanQRCode({
                    desc: 'scanQRCode desc'
                });
            };
            // 9.1.2 扫描二维码并返回结果
            document.querySelector('#scanQRCode1').onclick = function () {
                wx.scanQRCode({
                    needResult: 1,
                    desc: 'scanQRCode desc',
                    success: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            };

            // 10 微信支付接口
            // 10.1 发起一个支付请求
            document.querySelector('#chooseWXPay').onclick = function () {
                wx.chooseWXPay({
                    timestamp: 1414723227,
                    nonceStr: 'noncestr',
                    package: 'addition=action_id%3dgaby1234%26limit_pay%3d&bank_type=WX&body=innertest&fee_type=1&input_charset=GBK&notify_url=http%3A%2F%2F120.204.206.246%2Fcgi-bin%2Fmmsupport-bin%2Fnotifypay&out_trade_no=1414723227818375338&partner=1900000109&spbill_create_ip=127.0.0.1&total_fee=1&sign=432B647FE95C7BF73BCD177CEECBEF8D',
                    paySign: 'bd5b1933cda6e9548862944836a9b52e8c9a2b69'
                });
            };

            // 11.3  跳转微信商品页
            document.querySelector('#openProductSpecificView').onclick = function () {
                wx.openProductSpecificView({
                    productId: 'pDF3iY0ptap-mIIPYnsM5n8VtCR0'
                });
            };

            // 12 微信卡券接口
            // 12.1 添加卡券
            document.querySelector('#addCard').onclick = function () {
                wx.addCard({
                    cardList: [
                        {
                            cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
                            cardExt: '{"code": "", "openid": "", "timestamp": "1418301401", "signature":"64e6a7cc85c6e84b726f2d1cbef1b36e9b0f9750"}'
                        },
                        {
                            cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
                            cardExt: '{"code": "", "openid": "", "timestamp": "1418301401", "signature":"64e6a7cc85c6e84b726f2d1cbef1b36e9b0f9750"}'
                        }
                    ],
                    success: function (res) {
                        alert('已添加卡券：' + JSON.stringify(res.cardList));
                    }
                });
            };

            // 12.2 选择卡券
            document.querySelector('#chooseCard').onclick = function () {
                wx.chooseCard({
                    cardSign: '97e9c5e58aab3bdf6fd6150e599d7e5806e5cb91',
                    timestamp: 1417504553,
                    nonceStr: 'k0hGdSXKZEj3Min5',
                    success: function (res) {
                        alert('已选择卡券：' + JSON.stringify(res.cardList));
                    }
                });
            };

            // 12.3 查看卡券
            document.querySelector('#openCard').onclick = function () {
                alert('您没有该公众号的卡券无法打开卡券。');
                wx.openCard({
                    cardList: []
                });
            };

        });
        window.wx.error((err) => {
            console.error('upload/UploadContainer/wx/wxError')
            console.error(JSON.stringify(err))
        });
    }
}

class WechatSdk extends React.Component{

    componentWillMount() {

        ;//console.log("After fectuing signature map");
    };

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