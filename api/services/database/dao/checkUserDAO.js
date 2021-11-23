const database = require('../tools/database');
const log = require('../../../log/logger');

const errorMessage = "Data access error";

const SQL_INSERT = `INSERT INTO check_user SET status_phone = ?, status_mail = ?, status_identity = ?, img_identity = ?, status = ?, confirm_code = ?`;
const SQL_UPDATE_ACTIVE = `UPDATE  check_user SET status_mail = ?, status = ? WHERE id = ?`;
const SQL_UPDATE_CODE = `UPDATE check_user SET confirm_code = ? WHERE id = ?`;
const SQL_UPDATE = `UPDATE check_user SET img_identity = ? WHERE id = ?`;
const SELECT_BY_ID = `SELECT * FROM check_user WHERE id = ?`;
const SELECT_BY_CODE = `SELECT * FROM check_user WHERE confirm_code = ?`;
const SQL_REMOVE_CHECK = `DELETE FROM check_user WHERE id = ?`;

async function insert(){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [0, 0, 0,'','Pending','']);
        const id =  idCreated.insertId;
        return id;
    }catch (error) {
        log.error("Error checkDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function updateActive(id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE_ACTIVE, [1, 'Active', id]);
        const check = getById(id);
        return check;
    }catch (error) {
        log.error("Error checkDAO updateActive : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function updateCode(token, id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE_CODE, [token, id]);
        const check = getById(id);
        return check;
    }catch (error) {
        log.error("Error checkDAO updateCode : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(filename, id){
    let con = null;
    let file = '';
    if(filename){
        file = filename;
    }
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [file, id]);
    }catch (error) {
        log.error("Error checkDAO update : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getById(id){
    let con = null;
    try{
        con = await database.getConnection();
        const [check] = await con.execute(SELECT_BY_ID, [id]);
        return check;
    }catch (error) {
        log.error("Error checkDAO getById : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByCode(code){
    let con = null;
    try{
        con = await database.getConnection();
        const [check] = await con.execute(SELECT_BY_CODE, [code]);
        return check;
    }catch (error) {
        log.error("Error checkDAO getByCode : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function remove(id){
    let con = null
    try{
        con = await database.getConnection();
        await con.execute(SQL_REMOVE_CHECK, [id]);
    }catch (error) {
        log.error("Error checkDAO remove : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}
module.exports = {
    insert,
    update,
    getById,
    getByCode,
    updateActive,
    updateCode,
    remove
}
