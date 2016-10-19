import defaults from 'superagent-defaults';
import superagentPromisePlugin from 'superagent-promise-plugin';
var WechatSdkActions = require('../actions/WechatSdkActions');
import co from 'co';
const request = superagentPromisePlugin(defaults());


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

module.exports = WechatSdkSource;
