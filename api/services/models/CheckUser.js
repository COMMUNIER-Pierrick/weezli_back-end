module.exports = class CheckUser{
    constructor(id, statusPhone, statusMail, statusIdentity, imgIdentity, status, code) {
        this.id = id;
        this.statusPhone = statusPhone;
        this.statusMail = statusMail;
        this.statusIdentity = statusIdentity;
        this.imgIdentity = imgIdentity;
        this.status = status;
        this.code = code;
    }
    static CheckUserInsert(statusPhone, statusMail, statusIdentity, imgIdentity){
        return new CheckUser(null,statusPhone, statusMail, statusIdentity, imgIdentity)
    }
}
