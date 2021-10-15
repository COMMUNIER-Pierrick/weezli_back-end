module.exports = class Order {
    constructor(id, codeValidated, status, announce, dateOrder, buyer, qrCode, finalPrice) {
        this.id = id;
        this.codeValidated = codeValidated;
        this.status = status;
        this.announce = announce;
        this.dateOrder = dateOrder;
        this.buyer = buyer;
        this.qrCode = qrCode;
        this.finalPrice = finalPrice;

    }

    static OrderId(id, code, status, announce, dateOrder, buyer, qrCode, finalPrice){
        return new Order(id, code, status, announce, dateOrder, buyer, qrCode, finalPrice)
    };

    static OrderInsert(status, announce, dateOrder, buyer, qrCode, finalPrice){
        let code = Order.codeValidatedRandom();
        return new Order(null, code, status, announce, dateOrder, buyer, qrCode, finalPrice)
    };

    static codeValidatedRandom() {
        let longueur = 6,
            str = '1234567890',
            result = '',
            number = '1234567890',
            total = '' + str;

        result = str[Math.floor(Math.random() * str.length)];
        total += str.toUpperCase();
        total += number;

        for (let d = 1; d < longueur; d++) {
            result += total[Math.floor(Math.random() * total.length)];
        }
        return result;
    }
}