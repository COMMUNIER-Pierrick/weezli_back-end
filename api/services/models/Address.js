module.exports = class Address{
    constructor(id, nameInfo, number, street, additionalAddress, zipCode, city, country) {
        this.id = id;
        this.idInfo = nameInfo;
        this.number = number;
        this.street = street;
        this.additionalAddress = additionalAddress;
        this.zipCode = zipCode;
        this.city = city;
        this.country = country;
    }
}
