const database = require('../tools/database');
const log = require('../../../log/logger');
const checkDAO = require("./checkUserDAO");

const errorMessage = "Data access error";

const SQL_INSERT = `INSERT INTO payment SET name = ?, iban = ?, number_card = ?, expired_date_card = ? `;
const SELECT_BY_ID = `SELECT * FROM payment WHERE id = ?`;
const SQL_REMOVE_PAYMENT = `DELETE FROM payment WHERE id = ?`;

async function insert(){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, ['','','','']);
        const id =  idCreated.insertId;
        return id;
    }catch (error) {
        log.error("Error paymentDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(){

}

async function getById(id){
    let con = null;
    try{
        con = await database.getConnection();
        const [payment] = await con.execute(SELECT_BY_ID, [id]);
        return payment;
    }catch (error) {
        log.error("Error paymentDAO getById : " + error);
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
        await con.execute(SQL_REMOVE_PAYMENT, [id]);
    }catch (error) {
        log.error("Error paymentDAO remove : " + error);
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
    remove
}

