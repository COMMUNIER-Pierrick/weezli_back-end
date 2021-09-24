module.exports = class User{
    constructor(id, firstname, lastname, username, password, email, phone, dateOfBirthday,  active, url_profile_img, average_opinion, payment, choice, check, choiceDateStarted, choiceDateEnd) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.dateOfBirthday = dateOfBirthday;
        this.active = active;
        this.url_profile_img = url_profile_img;
        this.average_opinion = average_opinion;
        this.payment = payment;
        this.choice = choice;
        this.check = check;
        this.choiceDateStarted = choiceDateStarted;
        this.choiceDateEnd = choiceDateEnd;
    }

    static UserAnnounce(id, firstname, lastname){
        return new User(id, firstname, lastname, null, null, null, null, null,null, null, null, null, null, null);
    }

    static UserInsert(firstname, lastname, username, password, email, dateOfBirthday){
        return new User(null, firstname, lastname, username, password, email, null, dateOfBirthday,null, null, null, null, null, null)
    }
}
