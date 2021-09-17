module.exports = class Announce{
    constructor(packages, idType, price, transact, imgUrl, dateCreated, userAnnounce) {
       this.packages = packages;
       this.idType = idType;
       this.price = price;
       this.transact = transact;
       this.imgUrl = imgUrl;
       this.dateCreated = dateCreated;
       this.userAnnounce = userAnnounce;
    }
}

module.exports = class AnnounceId{
    constructor(id,packages,views = null, idType, price, transact, imgUrl, dateCreated, userAnnounce) {
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
