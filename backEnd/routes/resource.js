const fs = require('fs');
const path = require('path');
const mime = require('mime-types'); //需npm安装
const router = require('koa-router')()

router.get('/static', async (ctx) => {
    // console.log(`请求的图片地址为： ${ctx.url}`)
    // console.log(`请求的图片为： ${ctx.query.name}`)
    let filePath = getImagePath(ctx.query.name); //图片地址
    // console.log(filePath)
    let file = null;
    try {
        file = fs.readFileSync(filePath); //读取文件
    } catch (error) {
    	//如果服务器不存在请求的图片，返回默认图片
        filePath = path.join(__dirname , '../public/images/failed.svg'); //默认图片地址
        file = fs.readFileSync(filePath); //读取文件
    }

    let mimeType = mime.lookup(filePath); //读取图片文件类型
    ctx.set('content-type', mimeType); //设置返回类型
    ctx.body = file; //返回图片
});

module.exports = router


// 封装一个函数来处理文件路径  
function getImagePath(filename) {
    // 这里可以添加对 filename 的验证和清理逻辑  
    // 例如，确保 filename 只包含允许的字符，防止路径遍历等  
    if (!filename || typeof filename !== 'string') {
        throw new Error('Invalid filename');
    }
    // 使用 path.basename 来确保不会受到路径遍历攻击  
    return path.join(__dirname , '../public/images', path.basename(filename));
}
