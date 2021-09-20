module.exports = class Announce{
    constructor(id,packages,views, finalPrice, order, idType, price, transact, imgUrl, dateCreated, userAnnounce) {
        this.id = id;
        this.packages = packages;
        this.views = views;
        this.finalPrice = finalPrice;
        this.order = order;
        this.idType = idType;
        this.price = price;
        this.transact = transact;
        this.imgUrl = imgUrl;
        this.dateCreated = dateCreated;
        this.userAnnounce = userAnnounce;
    }

    static AnnounceId(id,packages,views, idType, price, transact, imgUrl, dateCreated, userAnnounce){
        return new Announce(id,packages,views,null,null,idType,price, transact, imgUrl, dateCreated, userAnnounce);
    }

    static AnnounceUpdate(id,packages, idType, price, transact, imgUrl, dateCreated, userAnnounce){
        return new Announce(id,packages, null, null, null, idType, price, transact, imgUrl, dateCreated, userAnnounce);
    }

    static AnnounceInsert(packages, idType, price, transact, imgUrl, dateCreated, userAnnounce){
        return new Announce(null, packages, null,null,null,idType, price, transact, imgUrl, dateCreated, userAnnounce);
    }
    /*
    constructor(packages, idType, price, transact, imgUrl, dateCreated, userAnnounce) {
       this.packages = packages;
       this.idType = idType;
       this.price = price;
       this.transact = transact;
       this.imgUrl = imgUrl;
       this.dateCreated = dateCreated;
       this.userAnnounce = userAnnounce;
    }*/
}
/*
module.exports = class AnnounceId{
    constructor(id,packages,views, idType, price, transact, imgUrl, dateCreated, userAnnounce) {
        this.id = id;
        this.packages = packages;
        this.views = views;
        this.idType = idType;
        this.price = price;
        this.transact = transact;
        this.imgUrl = imgUrl;
        this.dateCreated = dateCreated;
        this.userAnnounce = userAnnounce;
    }
}

module.exports = class AnnounceUpdate{
    constructor(id,packages, idType, price, transact, imgUrl, dateCreated, userAnnounce) {
        this.id = id;
        this.packages = packages;
        this.idType = idType;
        this.price = price;
        this.transact = transact;
        this.imgUrl = imgUrl;
        this.dateCreated = dateCreated;
        this.userAnnounce = userAnnounce;
    }
}
*/
