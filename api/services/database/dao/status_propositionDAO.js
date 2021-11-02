const database = require('../tools/database');
const log = require('../../../log/logger');
const StatusProposition = require("../../models/Status_proposition");
const Proposition = require("../../models/Proposition");

const SELECT_ALL = `SELECT * from status_proposition`;
const SELECT_BY_ID = `SELECT * from status_proposition WHERE id = ?`;
const SQL_INSERT = `INSERT INTO status_proposition SET name = ?`;
const SQL_UPDATE = `UPDATE status_proposition SET name = ? WHERE id = ?`;
const SQL_DELETE = `DELETE FROM status_proposition WHERE id = ?`;

const errorMessage = "Data access error";

async function getAll(){
    let con = null;
    try {
        con = await database.getConnection();
        const [rows] = await con.execute(SELECT_ALL);
        return rows;
    } catch (error) {
        log.error("Error status_propositionDAO selectAll : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insert(Status_proposition){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [Status_proposition.name]);
        const id = idCreated.insertId;
        const [result] = await getById({id})
        return result;
    }catch (error) {
        log.error("Error status_propositionDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(Status_proposition, id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [Status_proposition.name, id]);
        const [result] = await getById({id})
        return result;
    }catch (error) {
        log.error("Error status_propositionDAO update : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function remove({id}){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_DELETE, [id]);
    }catch (error) {
        log.error("Error status_propositionDAO delete : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getById(id){
    let con = null;
    try {
        con = await database.getConnection();
        const [status_proposition] = await con.execute(SELECT_BY_ID, [id]);
        const newStatus_proposition = Status_proposition.StatusId(status_proposition[0].id, status_proposition[0].name);
        return newStatus;
    } catch (error) {
        log.error("Error status_propositionDAO selectById : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

module.exports = {
    getAll,
    insert,
    update,
    remove,
    getById
}
