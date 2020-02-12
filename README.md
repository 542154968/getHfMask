# 合肥市冠状病毒期间口罩预约脚本

> 武汉加油！中国加油！

## 注意事项

1. 由于预约口罩的 API 经常更改，该脚本只能启到辅助作用，我能保证只要对方不改接口，这个脚本就能用。改了的话我能力范围内的会更新，所以请您手机也一起抢！手机为主，脚本为辅。
2. 请勿高频请求！请勿高频请求！
3. 每人一段时间只可预约一次，请勿重复预约。
4. 切勿用于商用。
5. 如若违法侵权请告知，必删。
6. 所有数据均从合肥医保预约口罩页面获取。
7. 为啥不用 ES6？因为我从网上抄的一段 request 请求方法，而且加密的也是 ES5，于是就统一 ES5，还兼容低版本 Node。哈哈哈哈哈。。。。
8. 由于预约网站加入了图形验证码和 cookie 机制，不能同个时间大量请求，会导致禁止请求。
9. 手机为主，脚本为辅。手机为主，脚本为辅。手机为主，脚本为辅。！！！因为不能知道对方是否改接口。

### 使用帮助

1. `confg.js`中的`getDataInterval`参数是多长时间请求一次，默认是 10000ms。
2. `userData.js`中，依次输入您的个人信息，其中`reservationNumber`为固定的**五个**，请勿改动。因为规定是预约只能预约 5 个且预约成功后，5 天内不可在此预约。
3. 如果您不知道您要领取的药店的名称和编号，请点击`getPharmacy.js`，在第二行`pharmacyName`处输入您想查询的药房名称，然后执行`node getPharmacy.js`即可查阅到相关信息。药房数据格式请查阅`common/pharmacy.json`，其中每个数据的`name`值，即为药店名称，其`code`就是药店的编号 ID。或者[在此查询](http://kzgm.bbshjz.cn:8000/ncms/mask/pharmacy-list)，其中编号 ID 可以通过审查元素或者接口信息中看到。
4. ![pharmacy](https://github.com/542154968/getHfMask/blob/master/images/pharmacy.jpg)
5. 0208 日，接口增加了图形验证码，为了破验证，我接入了百度云的[文字识别](https://console.bce.baidu.com/ai/#/ai/ocr/overview/index)，[接入文档](https://cloud.baidu.com/doc/OCR/s/Ok3h7ydf4)

#### 开始

1. 首先您要有`Node`环境，如果没有，请百度`Node`安装一个 - -
2. 运行`npm install`
3. 在`userData.js`中，按照提示填好**个人信息**和**药店信息**
4. 在`common/baidu.js`中，填入申请的图像识别的应用 ID 和其他信息。
5. 运行`node index.js` 即可开始请求，执行脚本会立即请求一次，然后默认每 10s 请求一次。请勿高频请求！每天 17:00 可预约第二日口罩。所以您每天 17:00:00 再启动该脚本吧~已经预约到的 5 天不能再预约了哦！如果出现验证码错误请重新启动该脚本。

##### 题外

1. 就在刚才我预约到了口罩，很开心，自己写的脚本有用~嘻嘻
2. ![requestInfo](https://github.com/542154968/getHfMask/blob/master/images/requestInfo.png)
3. ![getMaskDetail](https://github.com/542154968/getHfMask/blob/master/images/getMaskDetail.jpg)
