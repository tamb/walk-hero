import cuid from "cuid";

export default class Entity {
  constructor() {
    const date = new Date();
    this.date_created = date;
    this.date_modified = date;
    this.id = cuid();
  }
}
