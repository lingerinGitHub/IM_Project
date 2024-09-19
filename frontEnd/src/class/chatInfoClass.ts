enum Role {
    user = 'user',
    opposite = 'opposite'
}

interface chatInfo {
    role: Role;
    timeStamp: string; // 日期
    message: string;
}


class chatInfo implements chatInfo {
    public role: Role;
    public timeStamp: string;
    public message: string;
    constructor(role: Role, timeStamp: string, message: string){
        this.role = role;
        this.timeStamp = timeStamp;
        this.message = message;
    }
}



export {
    chatInfo,
    Role,
}
