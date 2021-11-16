const database = require('../tools/database');
const log = require('../../../log/logger');
const userDAO = require("./userDAO");
const Proposition = require("../../models/Proposition");
const announceDAO = require("./announceDAO");
const statusPropositionDAO = require("./status_propositionDAO");

const SELECT_ALL = `SELECT * from proposition`;

const SELECT_ALL_BY_ID_USER = `SELECT p.id_announce, p.id_user, p.proposition, p.id_status_proposition
                               FROM proposition p
                               INNER JOIN announce a ON p.id_announce = a.id
                               INNER JOIN rel_user_announce rua on a.id = rua.id_announce
                               INNER JOIN users u on rua.id_user = u.id
                               WHERE p.id_user = ? OR u.id = ?
                               ORDER BY p.date_created DESC`;

const SELECT_ALL_BY_ID_ANNOUNCE = `SELECT * from proposition WHERE id_announce = ?`;

const SELECT_BY_ID_ANNOUNCE_AND_ID_USER = `SELECT * from proposition WHERE id_announce = ? AND id_user = ?`;

const SQL_INSERT = `INSERT INTO proposition SET id_announce = ?, id_user = ?, proposition = ?, id_status_proposition = ?`;

const SQL_UPDATE = `UPDATE proposition SET proposition = ?, id_status_proposition = ? WHERE id_announce = ? AND id_user = ?`;

const SQL_DELETE = `DELETE FROM proposition WHERE id_announce = ?`;

const errorMessage = "Data access error";

async function getAllByUser(id_user){
    let con = null;
    try {
        con = await database.getConnection();
        const [propositions] = await con.execute(SELECT_ALL_BY_ID_USER, [id_user, id_user]);

        let newListProposition = [];
        for(let i = 0; i < propositions.length; i++){

            const proposition = await getByIdAnnounceAndUser(propositions[i].id_announce, propositions[i].id_user);
            newListProposition.push(proposition);

        }

        return newListProposition;
    } catch (error) {
        log.error("Error propositionDAO selectByIdUser : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getAll(){
    let con = null;
    try {
        con = await database.getConnection();
        const [rows] = await con.execute(SELECT_ALL);

        return rows;
    } catch (error) {
        log.error("Error propositionDAO selectAll : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insert(Proposition){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_INSERT, [Proposition.announce, Proposition.user, Proposition.proposition, Proposition.status_proposition]);
    }catch (error) {
        log.error("Error propositionDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(Proposition){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [Proposition.proposition, Proposition.status_proposition.id, Proposition.id_announce, Proposition.id_user]);
        const result = await getByIdAnnounceAndUser(Proposition.id_announce, Proposition.id_user);
        return result;
    }catch (error) {
        log.error("Error propositionDAO update : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function remove(id_announce){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_DELETE, [id_announce]);
    }catch (error) {
        log.error("Error propositionDAO delete : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByIdAnnounce(id_announce){
    let con = null;
    try {
        con = await database.getConnection();
        const [propositions] = await con.execute(SELECT_ALL_BY_ID_ANNOUNCE, [id_announce]);

        let newListProposition = [];
        for(let i = 0; i < propositions.length; i++){
            const proposition = await getByIdAnnounceAndUser(propositions[i].id_announce, propositions[i].id_user);
            newListProposition.push(proposition);
        }
        return newListProposition;
    } catch (error) {
        log.error("Error propositionDAO selectByIdAnnounce : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByIdAnnounceAndUser(id_announce, id_user){
    let con = null;
    try {
        con = await database.getConnection();
        const [proposition] = await con.execute(SELECT_BY_ID_ANNOUNCE_AND_ID_USER, [id_announce, id_user]);
        return proposition;
    } catch (error) {
        log.error("Error propositionDAO selectByIdAnnounceAndUser : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

module.exports = {
    getAll,
    getAllByUser,
    getByIdAnnounce,
    getByIdAnnounceAndUser,
    insert,
    update,
    remove,
}
