module.exports = class FinalPrice{
    constructor(id, proposition, accept, user) {
        this.id = id;
        this.proposition = proposition;
        this.accept = accept;
        this.user = user;
    }

    static FinalPriceId(id, proposition, accept, user){
        return new FinalPrice(id,proposition, accept, user);
    }
}
