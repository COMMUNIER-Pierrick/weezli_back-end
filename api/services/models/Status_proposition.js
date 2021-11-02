module.exports = class Status_proposition{
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static StatusPropositionId(id, name) {
        return new Status(id, name);
    }
}
