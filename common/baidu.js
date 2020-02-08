var AipOcrClient = require("baidu-aip-sdk").ocr;
// 设置APPID/AK/SK
var APP_ID = "";
var API_KEY = "";
var SECRET_KEY = "";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

function getCaptcha(url) {
    return client.generalBasic(url)
}


module.exports = getCaptcha