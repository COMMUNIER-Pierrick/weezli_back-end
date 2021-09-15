const database = require('../tools/database');
const log = require('../../../log/logger');

const SELECT_ALL = `SELECT * from transport`;
const SELECT_BY_ID = `SELECT * from transport WHERE id = ?`;
const SQL_INSERT = `INSERT INTO transport SET name = ?`;
const SQL_UPDATE = `UPDATE transport SET name = ? WHERE id = ?`;
const SQL_DELETE = `DELETE FROM transport WHERE id = ?`;

const errorMessage = "Data access error";

async function getAll(){
    let con = null;
    try {
        con = await database.getConnection();
        const [rows] = await con.execute(SELECT_ALL);
        return rows;
    } catch (error) {
        log.error("Error transportDAO selectAll : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insert(Transport){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [Transport.name]);
        const id = idCreated.insertId;
        const [result] = await getById({id})
        return result;
    }catch (error) {
        log.error("Error transportDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(Transport, id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [Transport.name, id]);
        const [result] = await getById({id})
        return result;
    }catch (error) {
        log.error("Error transportDAO update : " + error);
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
        log.error("Error transportDAO delete : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getById({id}){
    let con = null;
    try {
        con = await database.getConnection();
        const [rows] = await con.execute(SELECT_BY_ID, [id]);
        return rows;
    } catch (error) {
        log.error("Error transportDAO selectById : " + error);
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
