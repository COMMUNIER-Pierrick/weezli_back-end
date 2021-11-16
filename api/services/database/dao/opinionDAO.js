const database = require("../tools/database");
const log = require("../../../log/logger");
const Opinion = require("../../models/Opinion");

const SELECT_BY_ID = `SELECT * FROM opinion WHERE id = ?`;

async function getById(id){
    let con = null;
    try {
        con = await database.getConnection();
        const [o] = await con.execute(SELECT_BY_ID, [id]);
        console.log(o);
        const opinion = new Opinion(o[0].id, o[0].number, o[0].comment, o[0].id_Order);
        return opinion;
    } catch (error) {
        log.error("Error  : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getAllOpinionByUser(idUser){
    let con = null;
    try {
        con = await database.getConnection();

    } catch (error) {
        log.error("Error  : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getOpinionByOrder(idOrder){
    let con = null;
    try {
        con = await database.getConnection();

    } catch (error) {
        log.error("Error  : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insert(newOpinion){
    let con = null;
    try {
        con = await database.getConnection();

    } catch (error) {
        log.error("Error  : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(newOpinion){
    let con = null;
    try {
        con = await database.getConnection();

    } catch (error) {
        log.error("Error  : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function remove(id){
    let con = null;
    try {
        con = await database.getConnection();

    } catch (error) {
        log.error("Error  : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

module.exports = {
    insert,
    remove,
    update,
    getAllOpinionByUser,
    getOpinionByOrder,
    getById
};
