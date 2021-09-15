module.exports = class User{
    constructor(id, firstname, lastname, username, email, password, phone, active, urlProfileImg, averageOpinion, idRib, idChoice, idCheck) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.active = active;
        this.urlProfileImg = urlProfileImg
        this.averageOpinion = averageOpinion;
        this.idRib = idRib;
        this.idChoice = idChoice;
        this.idCheck = idCheck;
    }
}

module.exports = class UserAnnounce{
    constructor(id, firstname, lastname) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;

    }
}
