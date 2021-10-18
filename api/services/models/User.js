module.exports = class User{
    constructor(id, firstname, lastname, username, password, email, phone, dateOfBirthday,  active, filename, average_opinion, payment, choice, check, choiceDateStarted, choiceDateEnd, address) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.dateOfBirthday = dateOfBirthday;
        this.active = active;
        this.filename = filename;
        this.average_opinion = average_opinion;
        this.payment = payment;
        this.choice = choice;
        this.check = check;
        this.choiceDateStarted = choiceDateStarted;
        this.choiceDateEnd = choiceDateEnd;
        this.address = address;
    };

    static UserUpdate(firstname, lastname, email, phone, check, address){
        return new User(null, firstname, lastname, null, null, email, phone, null, null, null, null,null,null, check, null, null, address);
    };

    static UserAnnounce(id, firstname, lastname){
        return new User(id, firstname, lastname, null, null, null, null, null,null, null, null, null, null, null, null, null);
    };

    static UserInsert(firstname, lastname, username, password, email, dateOfBirthday, address){
        return new User(null, firstname, lastname, username, password, email, null, dateOfBirthday,null, null, null, null, null, null, null, null, address)
    };
}
