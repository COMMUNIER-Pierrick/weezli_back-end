const database = require("../tools/database");
const log = require("../../../log/logger");

const SQL_INSERT = `INSERT INTO package SET datetime_departure = ?, datetime_arrival = ?, kg_available = ?, description_condition = ?, id_transport = ?`
const SQL_DELETE = `DELETE FROM package WHERE  id = ?`
const SELECT_BY_ID = `SELECT id, datetime_departure, datetime_arrival, kg_available, description_condition, id_transport 
                        FROM package 
                        WHERE id = ?`;

const errorMessage = "Data access error";

async function insert(Package){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [Package.datetimeDeparture, Package.datetimeArrival,
            Package.kgAvailable, Package.description, Package.idTransport]);
        const id = idCreated.insertId;
        const [result] = await getById(id)
        return result;
    }catch (error) {
        log.error("Error packageDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(){

}

async function remove(id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_DELETE, [id]);
    }catch (error) {
        log.error("Error packageDAO delete : " + error);
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
        log.error("Error packageDAO selectById : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getAll(){

}

module.exports = {
    getAll,
    insert,
    update,
    remove,
    getById
}
