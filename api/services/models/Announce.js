module.exports = class Announce{
    constructor(id,packages,views, idType, price, imgUrl, dateCreated, userAnnounce) {
        this.id = id;
        this.packages = packages;
        this.views = views;
        this.idType = idType;
        this.price = price;
        this.imgUrl = imgUrl;
        this.dateCreated = dateCreated;
        this.userAnnounce = userAnnounce;
    }

    static AnnounceAll(id,packages,views, idType, price, imgUrl, dateCreated, userAnnounce) {
        return new Announce(id,packages,views, idType, price, imgUrl, dateCreated, userAnnounce);
    }

    static AnnounceUpdate(id,packages, idType, price, imgUrl, userAnnounce){
        return new Announce(id,packages, null, idType, price, imgUrl, null, userAnnounce);
    }

    static AnnounceInsert(packages, idType, price, imgUrl, userAnnounce){
        return new Announce(null, packages, null, idType, price,imgUrl, null, userAnnounce);
    }
}
