import URI from 'urijs';

const mobileReg = /(^(13\d|14[57]|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7})$/;

const makePath = (vendor_code, desk_no, page) => {
  if(desk_no) {
    const basePath = `/t/${vendor_code}-${desk_no}`;
    return page ? `${basePath}/${page}`: basePath;
  } else {
    return `/t/${vendor_code}`;
  }
};

export default {
  isWeixinBrowser(){
    return (/MicroMessenger/i).test(window.navigator.userAgent);
  },
  genWXCodeURL: function(appId, redirectURL) {

    return new URI("https://open.weixin.qq.com/connect/oauth2/authorize")
      .addQuery("appid", appId)
      .addQuery("redirect_uri", redirectURL)
      .addQuery("response_type", "code")
      .addQuery("scope", "snsapi_userinfo")
      .addQuery("response_type", "code")
      .hash("wechat_redirect")
      .toString();
  },

  isValidatePhone(mobile) {
    return mobileReg.test(mobile);
  },

  makeFullURL(vendor_code, desk_no, page) {
    const path = makePath(vendor_code, desk_no, page);
    return document.location.origin + path;
  },

  makePath
};
