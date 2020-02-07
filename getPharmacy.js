// 在此输入您想查询的药房名称，即可获取信息。 ！！！
var pharmacyName = ''

// 加密方法
var isvData = require("./common/isv");
// 请求方法
var request = require("./common/request");
// 公共配置
var config = require("./config")

var isvUrl = isvData(
    config.urlFirst + "/mask/pharmacy-search?pharmacyName=" + pharmacyName
)

request(
    "POST",
    isvUrl,
    null,
    function (data) {
       console.log(data)
       console.log('当前医院信息已查询完毕')
    }
);