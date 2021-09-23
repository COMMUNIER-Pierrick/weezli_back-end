const database = require('../tools/database');
const log = require('../../../log/logger');

const SELECT_ALL = `SELECT * from final_price`;
const SELECT_BY_ID = `SELECT * from final_price WHERE id = ?`;
const SQL_INSERT = `INSERT INTO final_price SET proposition = ?, accept = ?`;
const SQL_UPDATE = `UPDATE final_price SET proposition = ?, accept = ? WHERE id = ?`;
const SQL_DELETE = `DELETE FROM final_price WHERE id = ?`;

const errorMessage = "Data access error";

async function getAll(){
    let con = null;
    try {
        con = await database.getConnection();
        const [rows] = await con.execute(SELECT_ALL);
        return rows;
    } catch (error) {
        log.error("Error finalPriceDAO selectAll : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insert(proposition, accept){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [proposition, accept]);
        const id = idCreated.insertId;
        const [result] = await getById({id})
        return result;
    }catch (error) {
        log.error("Error finalPriceDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(proposition, accept, id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [proposition, accept, id]);
        const [result] = await getById({id})
        return result;
    }catch (error) {
        log.error("Error finalPriceDAO update : " + error);
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
        log.error("Error finalPriceDAO delete : " + error);
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
        log.error("Error finalPriceDAO selectById : " + error);
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
