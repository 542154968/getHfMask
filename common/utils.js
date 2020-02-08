module.exports = {
    // 获取数量大于等于5的口罩信息
    findEnableMask: function (arr) {
        return arr.find(v => v.remain >= 0);
    },
    stopRequestByTimeId(timeId) {
        clearInterval(timeId)
    }
}