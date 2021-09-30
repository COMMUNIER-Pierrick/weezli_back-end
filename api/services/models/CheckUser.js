module.exports = class CheckUser{
    constructor(id, statusPhone, statusMail, statusIdentity, filename, status, code) {
        this.id = id;
        this.statusPhone = statusPhone;
        this.statusMail = statusMail;
        this.statusIdentity = statusIdentity;
        this.filename = filename;
        this.status = status;
        this.code = code;
    }
    static CheckUserInsert(statusPhone, statusMail, statusIdentity, filename){
        return new CheckUser(null,statusPhone, statusMail, statusIdentity, filename, null, null)
    }
}
