// 辅助函数：检查字符串是否只包含数字或英文字符  
function isAlphaNumeric(str: string): boolean {
    return /^[0-9A-Za-z]+$/.test(str);
}

// 计数函数：返回中文字符、英文字符、特殊符号和数字的数量  
function countUsernameChars(username: string): { chinese: number, english: number, special: number, digit: number } {
    const chineseRegex = /[\u4e00-\u9fa5]/g;
    const englishRegex = /[A-Za-z]/g;
    const specialRegex = /[!@#$%^&*()_+[]\{}|;':",.<>?\/\\-]/g; // 注意：这里包含了常用的特殊字符，您可以根据需要调整  
    const digitRegex = /[0-9]/g;

    const chineseCount = (username.match(chineseRegex) || []).length;
    const englishCount = (username.match(englishRegex) || []).length;
    const specialCount = (username.match(specialRegex) || []).length;
    const digitCount = (username.match(digitRegex) || []).length;

    return { chinese: chineseCount, english: englishCount, special: specialCount, digit: digitCount };
}

class verifyResult {
    result:boolean;
    message:string

    constructor(result:boolean,message?:string){
        this.result = result,
        this.message = message == undefined ? '' : message
    }
}

// 判断用户名是否合法  
function isValidUsername(username: string): verifyResult {
    const result = countUsernameChars(username)
    const count = (result.chinese*1.5 + result.english*1 + result.english*1 + result.digit*1)

    if(username.length == 0){
        return new verifyResult(false, '请输入用户名');
    } else if(count > 20) {
        return new verifyResult(false, '用户名过长');
    } else {
        return new verifyResult(true)
    }

}


// 判断邮箱格式是否合法  
function isValidEmail(email: string): verifyResult {
    // 简单的邮箱格式验证正则表达式  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return new verifyResult(emailRegex.test(email.trim()), emailRegex.test(email.trim()) == true ? undefined : '请检查邮箱格式') ;
}

// 判断密码是否只含有数字，英文字符，且不但具有数字还要有英文字符  
function isValidPassword(password: string): verifyResult {
    if (!isAlphaNumeric(password)) {
        // 密码必须只包含数字和英文字符  
        return new verifyResult(false, '密码只能包含数字和英文字符');
    }
    // 检查密码长度是否大于8位  
    if (password.length < 8) {  
        return new verifyResult(false, '检查密码长度是否大于8位');  
    }  

    // 检查是否同时包含数字和英文字符  
    const hasDigit = /[0-9]/.test(password);
    const hasLetter = /[A-Za-z]/.test(password);
    return new verifyResult(hasDigit && hasLetter, (hasDigit && hasLetter) == false ? '密码需要同时包含数字和英文字符！' : undefined );
}

export {
    isValidUsername,
    isValidEmail,
    isValidPassword
}
