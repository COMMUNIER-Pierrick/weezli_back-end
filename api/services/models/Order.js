module.exports = class Order {
    constructor(id, codeValidated, status, announce, dateOrder, qrCode) {
        this.id = id;
        this.codeValidated = codeValidated;
        this.status = status;
        this.announce = announce;
        this.dateOrder = dateOrder;
        this.qrCode = qrCode;
    }

    static OrderInsert(codeValidated, status, announce, dateOrder){
        return new Order(null, codeValidated, status, announce, dateOrder, null)
    };

}
