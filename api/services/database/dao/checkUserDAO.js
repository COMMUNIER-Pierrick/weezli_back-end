const database = require('../tools/database');
const log = require('../../../log/logger');

const errorMessage = "Data access error";

const SQL_INSERT = `INSERT INTO check_user SET status_phone = ?, status_mail = ?, status_identity=?, img_identity = ?`;
const SQL_UPDATE = `UPDATE check_user SET img_identity = ? WHERE id = ?`;
const SELECT_BY_ID = `SELECT * FROM check_user WHERE id = ?`;

async function insert(){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, ['','','','']);
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

async function update(img, id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [img, id]);
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

module.exports = {
    insert,
    update,
    getById
}
