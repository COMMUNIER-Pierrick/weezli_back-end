module.exports = class Size{
    constructor(id, name, filename) {
        this.id = id;
        this.name = name;
        this.filename = filename;
    }

    static SizeInsert(name, filename) {
        return new Size(null, name, filename);
    }

}
