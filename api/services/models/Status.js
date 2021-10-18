module.exports = class Status{
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static StatusInsert(id, name) {
        return new Status(id, name);
    }
}
