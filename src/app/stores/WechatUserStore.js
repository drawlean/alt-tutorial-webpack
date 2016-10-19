var alt = require('../alt');
var WechatUserActions = require('../actions/WechatUserActions');
var WechatUserSource = require('../sources/WechatUserSource');

class WechatUserStore {
  constructor() {
    this.userInfo = [];
    this.errorMessage = null;

    this.bindActions(WechatUserActions);

    this.exportAsync(WechatUserSource);

  }

  onUpdateUserInfo(userInfo) {
    this.userInfo = JSON.parse(userInfo);
    this.errorMessage = null;
  }

  onGetUserInfoFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }

  onGetUserInfo() {
    return this.userInfo = [];
  }
}

module.exports = alt.createStore(WechatUserStore, 'WechatUserStore');
