import confidential from "./Confidential";

module.exports = {
	grant_type: 'client_credential',
	appid: confidential.APP_ID,
	secret: confidential.APP_SECRET,
	noncestr:'Wm3WZYTPz0wzccnW',
	accessTokenUrl:'https://api.weixin.qq.com/cgi-bin/token',
	ticketUrl:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
	cache_duration:1000*60*60*24
}
