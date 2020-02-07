// 加密方法
var isvData = require("./common/isv");
// 请求方法
var request = require("./common/request");
// 公共配置
var config = require("./config")
// 工具函数
var utils = require("./common/utils")
// 要发送的数据
var sendData = require('./userData')

function showEndTime(){
    console.log(
        "请求完成,用时" +
        (new Date().getTime() - Date.parse(config.startDate)) +
        "ms"
    );
}

// 获取口罩剩余数量
function getMaskCount() {
    var isvUrl = isvData(
        config.urlFirst + "/mask/pharmacy-stock?code=" + sendData.pharmacyCode
    )
    config.startDate = new Date();
    console.log("开始请求" + config.startDate.toLocaleString());
    request(
        "GET",
        isvUrl,
        null,
        function (data) {
            try {
                data = JSON.parse(data);
                var arr = JSON.parse(data.msg);
                console.log("当前口罩剩余量" + data.msg);
                data.succeed && getMask(arr);
            } catch (error) {
                console.log(error);
            }
        }
    );
}

// 发送个人信息去获取口罩
function getMask(arr) {
    var maskObj = utils.findEnableMask(arr);
    if (maskObj) {
        var isvUrl = isvData(
            config.urlFirst + "/mask/book"
        )
        sendData.pharmacyPhase = maskObj.value;
        sendData.pharmacyPhaseName = maskObj.text;
        console.log('当前发送的个人数据为', sendData)
        request("POST", isvUrl, sendData, function (
            res
        ) {
            console.log(res);
            utils.stopRequestByTimeId(config.timeId)
            showEndTime()
        });
    } else {
        console.log("没有口罩啦，终止请求。");
        utils.stopRequestByTimeId(config.timeId)
        showEndTime()
    }
}




// 开始请求 
getMaskCount();
config.timeId = setInterval(function(){
    getMaskCount()
}, config.getDataInterval)
