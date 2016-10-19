# Alt Tutorial

## Getting Started

```bash
git clone https://github.com/kzlathander/alt-tutorial-webpack.git
cd alt-tutorial-webpack
git checkout 10
npm install
npm run build
babel-node src/server/server.js
```

## Note

最后大家记得在src/app/config/Confidentail.js和src/server/config/Confidentail.js中根据你自己的情况填写相应信息:

const confidential = {
    APP_ID: 'xxxxxx', //Please use your owe app id;
    APP_SECRET: 'xxxxx', //Please use your owe secret
};

export default confidential;

## License

MIT
