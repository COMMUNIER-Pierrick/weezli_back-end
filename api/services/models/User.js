module.exports = class User{
    constructor(id, firstname, lastname, username, password, email, phone, active, url_profile_img, average_opinion, Payment, Choice, Check, choiceDateStarted, choiceDateEnd) {
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
        this.Payment = Payment;
        this.Choice = Choice;
        this.Check = Check;
        this.choiceDateStarted = choiceDateStarted;
        this.choiceDateEnd = choiceDateEnd;
    }

    static UserAnnounce(id, firstname, lastname){
        return new User(id, firstname, lastname, null, null, null, null, null, null, null, null, null, null);
    }

    static UserInsert(firstname, lastname, username, password, email){
        return new User(null, firstname, lastname, username, password, email, null, null, null, null, null, null, null)
    }
}
