var express = require('express')
var path = require('path')
import defaults from 'superagent-defaults';
import superagentPromisePlugin from 'superagent-promise-plugin';
import co from 'co';
const request = superagentPromisePlugin(defaults());
var signature = require('./libs/signature');
var wechat_cfg = require('./config/wechat.cfg');

var app = express()

let locations = [
  { id: 0, name: 'Abu Dhabi' },
  { id: 1, name: 'Berlin' },
  { id: 2, name: 'Bogota' },
  { id: 3, name: 'Buenos Aires' },
  { id: 4, name: 'Cairo' },
  { id: 5, name: 'Chicago' },
  { id: 6, name: 'Lima' },
  { id: 7, name: 'London' },
  { id: 8, name: 'Miami' },
  { id: 9, name: 'Moscow' },
  { id: 10, name: 'Mumbai' },
  { id: 11, name: 'Paris' },
  { id: 12, name: 'San Francisco' }
];

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, '../../build')))
//app.use(express.static(path.join(__dirname, './')))

app.get("/api/locations", function(req,res) {

  new Promise(function (resolve, reject) {
    // simulate an asynchronous flow
    setTimeout(function () {

      // change this to `false` to see the error action being handled.
      if (true) {
        // resolve with some mock data
        res.send(locations);
        resolve();
      } else {
        reject('Things have broken');
      }
    }, 1000);
  });

})

app.get("/api/signature", function(req,res) {

    const url = req.query.url.split('#')[0];

    signature.sign(url,function(signatureMap){
        signatureMap.appId = wechat_cfg.appid;
        res.send(signatureMap);
    });

})

app.get("/api/user_info", function(req,res) {

	const code = req.query.code;
    let tokenInfo = null;
	let userInfo = null;
    const getTokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wechat_cfg.appid}&secret=${wechat_cfg.secret}&code=${code}&grant_type=authorization_code`;
	console.log(getTokenUrl);


    co ( function *() {
        try {
            let result = yield request.get(getTokenUrl);
            tokenInfo = JSON.parse(result.text);
        }catch (e) {
            console.log("exception on getting access token");
            tokenInfo = null;
        }
		console.log("token info:",tokenInfo);

		if( tokenInfo != null ) {
			const getUserInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenInfo.access_token}&openid=${tokenInfo.openid}&lang=zh_CN`;
			try {
				const result2 = yield request.get(getUserInfoUrl);
				userInfo = JSON.parse(result2.text);
			} catch(e) {
				console.log("Exception on getting user info");
				userInfo = null;
			}
			console.log("userInfo:",userInfo);
		}
		
		if (userInfo) {
			res.send(userInfo);
		} else {
			res.send("error");
		}
    })

})

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'))
})



var PORT = 8080
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})
