const database = require('../tools/database');
const log = require('../../../log/logger');
const userDAO = require("./userDAO");
const Proposition = require("../../models/Proposition");
const announceDAO = require("./announceDAO");
const statusPropositionDAO = require("./status_propositionDAO");

const SELECT_ALL = `SELECT * from proposition`;

const SELECT_ALL_BY_ID_ANNOUNCE = `SELECT * from proposition WHERE id_announce = ?`;

const SELECT_BY_ID_ANNOUNCE_AND_ID_USER = `SELECT * from proposition WHERE id_announce = ? AND id_user = ?`;

const SQL_INSERT = `INSERT INTO proposition SET id_announce = ?, id_user = ?, proposition = ?, id_status_proposition = ?`;

const SQL_UPDATE = `UPDATE proposition SET proposition = ?, id_status_proposition = ? WHERE id_announce = ? AND id_user = ?`;

const SQL_DELETE = `DELETE FROM proposition WHERE id_announce = ?`;

const errorMessage = "Data access error";

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
        await con.execute(SQL_INSERT, [Proposition.id_announce, Proposition.id_user, Proposition.proposition, Proposition.status_proposition]);
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
        await con.execute(SQL_UPDATE, [Proposition.proposition, Proposition.status_proposition, Proposition.id_announce, Proposition.id_user]);
        const result = await getByIdAnnouceAndUser(Proposition.id_announce, Proposition.id_user);
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

async function getByIdAnnouce(id_announce){
    let con = null;
    try {
        con = await database.getConnection();
        const [propositions] = await con.execute(SELECT_ALL_BY_ID_ANNOUNCE, [id_announce]);

        let newListProposition = [];
                for(let i = 0; i < propositions.length; i++){
                    const proposition = await getByIdAnnouceAndUser(propositions[i].id_announce, propositions[i].id_user);
                    newListProposition.push(proposition);
                }
                return newListProposition;
    } catch (error) {
        log.error("Error propositionDAO selectByIdAnnouce : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByIdAnnouceAndUser(id_announce, id_user){
    let con = null;
    try {
        con = await database.getConnection();
        const [proposition] = await con.execute(SELECT_BY_ID_ANNOUNCE_AND_ID_USER, [id_announce, id_user]);
        return proposition;
    } catch (error) {
        log.error("Error propositionDAO selectByIdAnnouceAndUser : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

module.exports = {
    getAll,
    getByIdAnnouce,
    getByIdAnnouceAndUser,
    insert,
    update,
    remove,
}
