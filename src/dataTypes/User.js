import Entity from "./Entity"

export default class User extends Entity{
    constructor(username){
        super();
        this.username = username;
        this.icon_id = 1;
        this.hero_type_id = 1; 
    }
}