module.exports = class Payment{
    constructor(id, name, iban, numberCard, expiredDateCard) {
        this.id = id;
        this.name = name;
        this.iban = iban;
        this.numberCard = numberCard;
        this.expiredDateCard = expiredDateCard;
    }

    static PaymentInserter(name,iban) {
        return new Payment(null, name, iban);
    }
}
