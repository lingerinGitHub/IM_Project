interface contentType {
    type?:string;
    data?:object;
}

export class resBody implements contentType {
    data?: any = null;//默认为空
    type?: string;
    constructor(type?:string, data?:object){
        switch (type){
            case ('json'):
                this.type = 'application/json';
                this.data = JSON.stringify(data)
                break;
            case ('form'):
                this.type = 'application/x-www-form-urlencoded';
                break;
            case ('media'):
                this.type = 'multipart/form-data';
                break;
            default:
                this.type = 'application/json';// 默认json格式
        }
        this.data = data; 
    };

    public getType(){
        return this.type;
    }

    public getData(){
        return this.data;
    }
}
// 移除引用，帮助垃圾回收  
//myInstance = null; // 或者将引用设置为其他对象或undefined 