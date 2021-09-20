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
/*
module.exports = class Choice{
    constructor(name, description, price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }
}

*/
