module.exports = class Rib{
    constructor(id, name, iban) {
        this.id = id;
        this.name = name;
        this.iban = iban;
    }

    static RibInserter(name,iban) {
        return new Rib(null, name, iban);
    }
}

/*
module.exports = class insertRib{
    constructor(name, iban) {
        this.name = name;
        this.iban = iban;
    }
}
*/
