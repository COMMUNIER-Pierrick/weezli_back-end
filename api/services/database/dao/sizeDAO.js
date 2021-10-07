const database = require('../tools/database');
const log = require('../../../log/logger');

const SELECT_ALL = `SELECT * from size`;
const SELECT_BY_ID = `SELECT * from size WHERE id = ?`;
const SQL_INSERT = `INSERT INTO size SET name = ?, filename = ?`;
const SQL_UPDATE = `UPDATE size SET name = ?, filename = ? WHERE id = ?`;
const SQL_DELETE = `DELETE FROM size WHERE id = ?`;
const SQL_INSERT_RELATION = `INSERT INTO rel_package_sizes SET id_package = ?, id_size = ?`;
const SQL_UPDATE_RELATION = `UPDATE rel_package_sizes SET id_size = ? WHERE id_package = ?`;
const SQL_REMOVE_RELATION = `DELETE FROM rel_package_sizes WHERE  id_package = ? AND id_size = ?`
const SELECT_BY_PACKAGE = `SELECT s.id, s.name, s.filename FROM size s
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
        log.error("Error sizeDAO selectAll : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insert(name, filename){
    let con = null;
    let file = '';
    if(filename){
        file = filename;
    }
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [name, file]);
        const id =  idCreated.insertId;
        const [result] = await getById(id)
        return result;
    }catch (error) {
        log.error("Error sizeDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(name, filename, id){
    let con = null;
    let file = '';
    if(filename){
        file = filename;
    }
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [name, file, id]);
        const [result] = await getById(id)
        return result;
    }catch (error) {
        log.error("Error sizeDAO update : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function remove(id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_DELETE, [id]);
    }catch (error) {
        log.error("Error sizeDAO delete : " + error);
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
        log.error("Error sizeDAO selectById : " + error);
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
        log.error("Error sizeDAO insertRelation : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function updateRelation(idPackage, idSize){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE_RELATION, [idSize, idPackage]);
    }catch (error) {
        log.error("Error sizeDAO insertRelation : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function removeRelation(idPackage, idSize){
        let con = null;
        try{
            con = await database.getConnection();
            await con.execute(SQL_REMOVE_RELATION, [idPackage, idSize])
        }catch (error) {
            log.error("Error sizeDAO removeRelation : " + error);
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
            sizes.push({"size": rows[i]});
        }
        return [sizes];
    } catch (error) {
        log.error("Error sizeDAO selectByPackage : " + error);
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
    getByPackage,
    removeRelation,
    updateRelation
}
