module.exports = class Proposition{
    constructor(id_announce, id_user, proposition, status_proposition) {
        this.id_announce = id_announce;
        this.id_user = id_user;
        this.proposition = proposition;
        this.status_proposition = status_proposition;
    }
}
