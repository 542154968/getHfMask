// 在此输入您想查询的药房名称，即可获取信息。 ！！！
// 那个查询药店的时候根据药店名字或者街道来查。只能输入一个关键字。
var pharmacyName = '坝下路'

// 加密方法
var {
    isvData
} = require("./common/isv");
// 请求方法
var request = require("./common/requestForm");
// 公共配置
var config = require("./config")

var isvUrl = config.urlFirst + "/mask/pharmacy-search"

request(
    "POST",
    isvUrl, {
        pharmacyName: pharmacyName,
        areaId: '',
        pageNum: 1,
        pageSize: 100
    },
    function (data) {
        console.log(data)
        console.log('当前药房信息已查询完毕')
    }
);