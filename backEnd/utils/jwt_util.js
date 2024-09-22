const jwt = require('jsonwebtoken')
const { tokenSecret } = require('../common/password.js')

function generateToken(id) {
    if(id == undefined || id == null){
        throw error('非法访问！');
    }
    const token = jwt.sign({
        data: {id: id}
    }, tokenSecret, { expiresIn: (24 * 7) + 'h' });//7天过期
    return token;
}

//验证token是否合法,返回false，true
function verifyToken(token) {
    return jwt.verify(token, tokenSecret, (err, decoded) => {
        if (err) {
            console.log('Error: Invalid Token!');
            return false;
        } else {
            return true;
        }
    })
}

//验证token是否合法,合法返回用户id
function verifyTokenId(token) {
    return jwt.verify(token, tokenSecret, (err, decoded) => {
        if (err) {
            console.log('Error: Invalid Token!');
            return false;
        } else {
            return decoded;
        }
    })
}

module.exports = {
    generateToken,
    verifyToken,
    verifyTokenId
}