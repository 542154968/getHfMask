/**
 * 奈何免费的代理HTTP(S)不能用的太多了，有需要的买一些吧，然后将代理IP存到全局中，再把请求改造下，如果是IP限制请求次数，那么用代理IP可以解决。
 */

var request = require("request");
var cheerio = require("cheerio");

function getProxyList() {
    var apiURL = "http://www.89ip.cn/index_32.html";

    return new Promise((resolve, reject) => {
        var options = {
            method: "GET",
            url: apiURL,
            // proxy: '<ip>:<port>',
            // gzip: true,
            encoding: null,
            headers: {
                Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                // 'Accept-Encoding': 'gzip, deflate',
                "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
                "User-Agent":
                    "Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
                referer: "http://www.66ip.cn/"
            }
        };

        request(options, function(error, response, body) {
            try {
                body = new Buffer(body).toString();

                if (error) throw error;

                var ipArr = getIps(body);

                resolve(ipArr);
            } catch (e) {
                console.log(e);
                return reject(e);
            }
        });
    });
}

function getIps(htmlStr) {
    var ipArr = [];
    var $ = cheerio.load(htmlStr);
    $(".layui-table tbody tr").each((i, v) => {
        var $item = $(v);
        var ip = $item.find("td:nth-child(1)").text();
        var port = $item.find("td:nth-child(2)").text();
        // var httpType = $item.find("td:nth-child(6)").text();
        // httpType.toLowerCase()
        ipArr.push(
            "http://" + ip.trim() + ":" + port.trim(),
            "https://" + ip.trim() + ":" + port.trim()
        );
    });
    return ipArr;
}

getProxyList()
    .then(function(proxyList) {
        var canUseIpArr = [];
        var targetOptions = {
            method: "GET",
            url: "http://ip.chinaz.com/getip.aspx",
            timeout: 8000,
            encoding: null
        };

        proxyList.forEach(function(proxyurl) {
            console.log(`testing ${proxyurl}`);
            targetOptions.proxy = proxyurl;
            request(targetOptions, function(error, response, body) {
                try {
                    if (error) throw error;
                    body = new Buffer(body).toString();

                    if (body) {
                        console.log("验证成功" + targetOptions.proxy);
                        canUseIpArr.push(targetOptions.proxy);
                    }
                } catch (e) {
                    // console.error(e);
                }
            });
        });
    })
    .catch(e => {
        console.log(e);
    });
