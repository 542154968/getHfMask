// 加密方法
var isvData = require("./common/isv");
// 请求方法
var request = require("./common/request");
var requestImg = require("./common/requestImg");
var fs = require("fs");

// 公共配置
var config = require("./config");
// 工具函数
var utils = require("./common/utils");
// 要发送的数据
var sendData = require("./userData");
// 获取验证码
var getCaptcha = require("./common/baidu");

function showEndTime() {
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
    );
    config.startDate = new Date();
    console.log("开始请求" + config.startDate.toLocaleString());
    request("GET", isvUrl, null, function (data) {
        try {
            data = JSON.parse(data);
            var arr = JSON.parse(data.msg);
            console.log("当前口罩剩余量" + data.msg);
            data.succeed && getMask(arr);
        } catch (error) {
            console.log(error);
        }
    });
}

// 发送个人信息去获取口罩
function getMask(arr) {
    var maskObj = utils.findEnableMask(arr);
    if (maskObj) {
        var isvUrl = isvData(config.urlFirst + "/mask/book");

        sendData.pharmacyPhase = maskObj.value;
        sendData.pharmacyPhaseName = maskObj.text;
        console.log("当前发送的个人数据为", sendData);
        request("POST", isvUrl, sendData, function (res) {
            try {
                console.log("获取的数据为", res);
                res = JSON.parse(res);
                res.succeed && utils.stopRequestByTimeId(config.timeId);
                showEndTime();
            } catch (error) {
                showEndTime();
            }
        });
    } else {
        console.log("没有口罩啦，终止本次请求。");
        showEndTime();
    }
}

var base64Reg = /^data:image\/\w+;base64,/;
var SPLIT_STR = 'EAPwD';
var splitReg = new RegExp(SPLIT_STR, 'g');

function getCaptchaTextAndStartGetMask() {
    requestImg(config.urlFirst + "/mask/captcha", null, function (res) {
        var imgData = res;
        // 这段是因为0211号图片解析失败了 对比了大量数据发现从这个 EAPwd 之前的都是不变的，于是我把老的这一部分 替换到现在返回的这一部分 就可以正常解析了
        if (splitReg.test(res)) {
            res = res.replace(/\n/g, '')
            var startStr = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAlAFYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD'
            var index = res.indexOf(SPLIT_STR) + 5;
            imgData = startStr + res.substring(index)
        }
        if (base64Reg.test(imgData)) {
            var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
            imgData = Buffer.from(base64Data, "base64"); // 解码图片
            fs.writeFile("test.jpg", imgData, checkCaptchaData);
        } else {
            fs.writeFile("test.jpg", imgData, "binary", checkCaptchaData);
        }

        function checkCaptchaData(err) {
            if (err) {
                console.log("文件下载失败.");
            }
            var image = fs.readFileSync("test.jpg").toString("base64");
            getCaptcha(image).then(captchaData => {
                console.log(captchaData);
                var captcha =
                    captchaData.words_result[0] &&
                    captchaData.words_result[0].words;
                sendData.captcha = captcha;
                getMaskCount();
                config.timeId = setInterval(function () {
                    getMaskCount();
                }, config.getDataInterval);
            });
        }
    });
}

function getCookie() {
    return new Promise((resolve, reject) => {
        request(
            "GET",
            config.urlFirst + "/mask/book-view",
            null,
            function (res) {
                resolve();
            },
            function (err) {
                reject(err);
            }
        );
    });
}

getCookie()
    .then(() => {
        getCaptchaTextAndStartGetMask();
    })
    .catch(() => {
        console.log("cookie获取失败，终止");
    });