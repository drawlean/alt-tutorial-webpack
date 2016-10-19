var alt = require('../alt');
var WechatSdkActions = require('../actions/WechatSdkActions');
var WechatSdkSource = require('../sources/WechatSdkSource');

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
