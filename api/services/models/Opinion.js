module.exports = class Opinion{
    constructor(id, number, comment, idOrder) {
        this.id = id;
        this.number = number;
        this.comment = comment;
        this.idOrder = idOrder;
    }

    static OpinionInsert(number, comment, idOrder) {
        return new Opinion(null,number, comment, idOrder);
    }

    static OpinionUpdate(id, number, comment) {
        return new Opinion(id, number, comment);
    }
}
