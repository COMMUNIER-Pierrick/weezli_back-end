module.exports = class CheckUser{
    constructor(id, statusPhone, statusMail, statusIdentity, imgIdentity) {
        this.id = id;
        this.statusPhone = statusPhone;
        this.statusMail = statusMail;
        this.statusIdentity = statusIdentity;
        this.imgIdentity = imgIdentity;
    }
    static CheckUserInsert(statusPhone, statusMail, statusIdentity, imgIdentity){
        return new CheckUser(null,statusPhone, statusMail, statusIdentity, imgIdentity)
    }
}
