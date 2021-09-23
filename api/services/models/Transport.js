module.exports = class Transport{
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    static TransportInsert(name) {
        return new Transport(null, name);
    }
}
