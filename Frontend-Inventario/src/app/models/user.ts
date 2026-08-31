export class User{
    constructor(
        public user_id:number,
        public name:string,
        public email:string,
        public password:string,
        public role_id:number | null,
    ){}
}

export class UserPaylod{
    constructor(
        public id:number,
        public name:string,
        public role:number | null,
    ){}
}

export class UserProfile{
    constructor(
        public user_id:number,
        public name:string,
        public email:string,
    ){}
}

