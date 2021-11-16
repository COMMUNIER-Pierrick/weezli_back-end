module.exports = class Payment{
    constructor(id, idUserAPI, idWalletAPI, amount) {
        this.id = id;
        this.idUserAPI = idUserAPI;
        this.idWalletAPI = idWalletAPI;
        this.amount = amount;
    }
}
