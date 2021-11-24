module.exports = class Order {
    constructor(id, codeValidated, id_status, id_announce, dateOrder, qrCode, opinions) {
        this.id = id;
        this.codeValidated = codeValidated;
        this.id_status = id_status;
        this.id_announce = id_announce;
        this.dateOrder = dateOrder;
        this.qrCode = qrCode;
        this.opinions = opinions;
    }

    static OrderInsert(codeValidated, id_status, id_announce, dateOrder){
        return new Order(null, codeValidated, id_status, id_announce, dateOrder, null, null)
    };

    static OrderForOpinion(id,codeValidated, id_status, id_announce, dateOrder){
        return new Order(id, codeValidated, id_status, id_announce, dateOrder, null, null)
    };

}
