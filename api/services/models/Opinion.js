module.exports = class Opinion{
    constructor(id, number, comment, idUser, status, idUserOpinion, idOrder, idTypes) {
        this.id = id;
        this.number = number;
        this.comment = comment;
        this.idUser = idUser;
        this.status = status;
        this.idUserOpinion = idUserOpinion;
        this.idOrder = idOrder;
        this.idTypes = idTypes;
    }

    static OpinionInsert(number, comment, idUser) {
        return new Opinion(null,number, comment, idUser, null, null, null, null);
    }

    static OpinionUpdate(id, number, comment, status) {
        return new Opinion(id, number, comment, null, status, null, null ,null);
    }
}
