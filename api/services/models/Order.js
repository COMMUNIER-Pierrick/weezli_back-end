module.exports = class Order {
    constructor(id, codeValidated, status, announce, dateOrder, qrCode) {
        this.id = id;
        this.codeValidated = codeValidated;
        this.status = status;
        this.announce = announce;
        this.dateOrder = dateOrder;
        this.qrCode = qrCode;

    }

    static OrderInsert(status, announce, dateOrder, qrCode){
        let code = Order.codeValidatedRandom();
        return new Order(null, code, status, announce, dateOrder, qrCode)
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