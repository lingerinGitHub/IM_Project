// 编写获取时间戳的方法
const moment = require('moment');

// 获取当前时间戳
moment.locale('zh-cn');

// 获取当前时间戳20240813155811精确到秒
function getTimestamp() {
    // 获取当前时间
    const currentTime = moment().format();
    // 匹配正则表达式
    const reg = /\d/g; // \d 匹配一个数字，等价于 [0-9] 
    // 将匹配到的数字用空字符串连接起来
    const currentTimeStamp = currentTime.match(reg).join(''); // 获取时间戳
    return currentTimeStamp.slice(0, currentTimeStamp.length - 4);
}

module.exports = {
    getTimestamp,
}