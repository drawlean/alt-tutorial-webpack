import defaults from 'superagent-defaults';
import superagentPromisePlugin from 'superagent-promise-plugin';
var WechatUserActions = require('../actions/WechatUserActions');
import co from 'co';
const request = superagentPromisePlugin(defaults());


var WechatUserSource = {
  fetchUserInfo() {
    return {
      remote(state,code) {
        return co(function *() {
          let userInfo = null;
          const getUserInfoUrl = `/api/user_info?code=${code}`;
          try {
            let result = yield request.get(getUserInfoUrl);
            userInfo = result.text;
          } catch (e) {
            userInfo = null;
          }
          //console.log("userInfo:", userInfo);
          return userInfo;
        });
      },

      local() {
        // Never check locally, always fetch remotely.
        return null;
      },

      success: WechatUserActions.updateUserInfo,
      error: WechatUserActions.getUserInfoFailed,
      loading: WechatUserActions.getUserInfo,
    }
  }
};

module.exports = WechatUserSource;
