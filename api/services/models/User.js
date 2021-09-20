module.exports = class User{
    constructor(id, firstname, lastname, username, password, email, phone, active, url_profile_img, average_opinion, Rib, Choice, Check) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.active = active;
        this.url_profile_img = url_profile_img;
        this.average_opinion = average_opinion;
        this.Rib = Rib;
        this.Choice = Choice;
        this.Check = Check;
    }

    static UserAnnounce(id, firstname, lastname){
        return new User(id, firstname, lastname, null, null, null, null, null, null, null, null, null, null);
    }

    static UserInsert(firstname, lastname, username, password, email){
        return new User(null, firstname, lastname, username, password, email, null, null, null, null, null, null, null)
    }
}
/*
module.exports = class UserAnnounce{
    constructor(id, firstname, lastname) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
    }
}

module.exports = class UserInsert{
    constructor(firstname, lastname, username, password, email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

*/
