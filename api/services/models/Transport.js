module.exports = class Transport{
    constructor(id, name, filename) {
        this.id = id;
        this.name = name;
        this.filename = filename;
    }
    static TransportInsert(name, filename) {
        return new Transport(null, name, filename);
    }
}
