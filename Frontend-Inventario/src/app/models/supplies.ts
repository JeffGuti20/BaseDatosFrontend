export class Supplies {
    constructor(
        public supply_id:number,
        public name:string,
        public type:string,
        public stock:number,
        public image:string,
        public unit_price:number,
        public category_id:number,
    ){}
}