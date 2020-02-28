module.exports = {
  urlFirst: "http://kzgm.bbshjz.cn:8000/ncms",
  startDate: null,
  timeId: null,
  // 多少秒请求一次数据 单位ms  默认10s请求一次 请勿高频请求 
  getDataInterval: 10000,
  cookie: '',
  // 当前时间与对方服务端的时间差，我的时间和对方服务端大概差了 30s  如果出现一直请求频繁，可以尝试更改这个时间
  dateDifference: 30000
};