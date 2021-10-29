module.exports = class Choice{
    constructor(id, name, description, price, id_payment) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.id_payment = id_payment;
    }

    static ChoiceInsert(name, description, price) {
        return new Choice(null,name, description, price);
    }
}
