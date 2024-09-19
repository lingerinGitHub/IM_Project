import { loginUserInterface } from '../../interfaces/user/loginUsers'

export class loginUser implements loginUserInterface {
    public id: string;
    public photo: string;
    public name:string;
    public province: string;
    public city: string;
    public introduce?: string = "暂时没有简介";
    constructor(loginInfo :loginUserInterface){
        this.id = loginInfo.id;
        this.photo = loginInfo.photo;
        this.name = loginInfo.name;
        this.province = loginInfo.province;
        this.city = loginInfo.city;
        this.introduce = loginInfo.introduce;
    }
}
