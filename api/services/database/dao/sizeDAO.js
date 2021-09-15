const database = require('../tools/database');
const log = require('../../../log/logger');
const {string} = require("joi");

const SELECT_ALL = `SELECT * from size`;
const SELECT_BY_ID = `SELECT * from size WHERE id = ?`;
const SQL_INSERT = `INSERT INTO size SET name = ?`;
const SQL_UPDATE = `UPDATE size SET name = ? WHERE id = ?`;
const SQL_DELETE = `DELETE FROM size WHERE id = ?`;
const SQL_INSERT_RELATION = `INSERT INTO rel_package_sizes SET id_package = ?, id_size = ?`;
const SELECT_BY_PACKAGE = `SELECT s.id, s.name 
                           FROM size s
                           INNER JOIN rel_package_sizes rps on s.id = rps.id_size
                           INNER JOIN package p ON rps.id_package = p.id
                           WHERE p.id = ?`;

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

async function insert(Size){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [Size.name]);
        const id =  idCreated.insertId;
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

async function update(Size, id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [Size.name, id]);
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

async function getById({id}){
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

async function insertRelation(idPackage, idSize){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_INSERT_RELATION, [idPackage, idSize]);
    }catch (error) {
        log.error("Error statusDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByPackage(id){
    let con = null;
    try {
        con = await database.getConnection();
        const [rows] = await con.execute(SELECT_BY_PACKAGE, [id]);
        let sizes = [];
        for(let i = 0; i < rows.length; i++){
            sizes.push(rows[i].id);
        }
        return [sizes];
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
    getById,
    insertRelation,
    getByPackage
}
