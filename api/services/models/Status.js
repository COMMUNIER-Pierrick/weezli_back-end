module.exports = class Status{
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static StatusId(id, name) {
        return new Status(id, name);
    }
}
