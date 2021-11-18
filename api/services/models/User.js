module.exports = class User{
    constructor(id, firstname, lastname, username, password, email, phone, dateOfBirthday,  active, filename, average_opinion, payment, check, address) {
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
        this.check = check;
        this.address = address;
    };

    static UserUpdate(firstname, lastname, email, phone, check, address){
        return new User(null, firstname, lastname, null, null, email, phone, null, null, null, null,null, check, address);
    };

    static UserInsert(firstname, lastname, username, password, email, dateOfBirthday, address){
        return new User(null, firstname, lastname, username, password, email, null, dateOfBirthday,null, null, null, null, null, address)
    };
}
