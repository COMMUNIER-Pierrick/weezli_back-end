module.exports = class Choice{
    constructor(id, name, description, price) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    static ChoiceInsert(name, description, price) {
        return new Choice(null,name, description, price);
    }
}
