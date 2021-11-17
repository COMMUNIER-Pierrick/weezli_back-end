module.exports = class Opinion{
    constructor(id, number, comment, idUser, status) {
        this.id = id;
        this.number = number;
        this.comment = comment;
        this.idUser = idUser;
        this.status = status;
    }

    static OpinionInsert(number, comment, idUser) {
        return new Opinion(null,number, comment, idUser, null);
    }

    static OpinionUpdate(id, number, comment) {
        return new Opinion(id, number, comment, null, null);
    }
}
