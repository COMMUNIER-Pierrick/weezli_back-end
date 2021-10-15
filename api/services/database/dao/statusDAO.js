const database = require('../tools/database');
const log = require('../../../log/logger');

const SELECT_ALL = `SELECT * from status`;
const SELECT_BY_ID = `SELECT * from status WHERE id = ?`;
const SQL_INSERT = `INSERT INTO status SET name = ?`;
const SQL_UPDATE = `UPDATE status SET name = ? WHERE id = ?`;
const SQL_DELETE = `DELETE FROM status WHERE id = ?`;

const errorMessage = "Data access error";

async function getAll(){
    let con = null;
    try {
        con = await database.getConnection();
        const [rows] = await con.execute(SELECT_ALL);
        return rows;
    } catch (error) {
        log.error("Error statusDAO selectAll : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insert(Status){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [Status.name]);
        const id = idCreated.insertId;
        const [result] = await getById({id})
        return result;
    }catch (error) {
        log.error("Error statusDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(Status, id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [Status.name, id]);
        const [result] = await getById({id})
        return result;
    }catch (error) {
        log.error("Error statusDAO update : " + error);
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
        log.error("Error statusDAO delete : " + error);
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
        const [rows] = await con.execute(SELECT_BY_ID, [id]);
        return rows;
    } catch (error) {
        log.error("Error statusDAO selectById : " + error);
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
