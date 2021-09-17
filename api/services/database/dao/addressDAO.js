const database = require("../tools/database");
const log = require("../../../log/logger");

const SQL_INSERT = `INSERT INTO address SET id_info = ?, number = ?, street = ?, additional_address = ?, zipcode = ?, city = ?, country = ?`;
const SQL_DELETE = `DELETE FROM address WHERE id = ?`;
const SQL_INSERT_RELATION = `INSERT INTO rel_package_address SET id_package = ?, id_address = ?`;
const SQL_REMOVE_RELATION = `DELETE FROM rel_package_address WHERE  id_package = ? AND id_address = ?`
const SELECT_BY_ID_INFO = `SELECT a.id, i.name, a.number, a.street, a.additional_address, a.zipcode, a.city, a.country 
                            from address a 
                            INNER JOIN info i ON a.id_info = i.id
                            WHERE a.id = ?`;
const SELECT_BY_PACKAGE = `SELECT a.id, i.name, a.number, a.street, a.additional_address, a.zipcode, a.city, a.country
                            from address a
                            INNER JOIN rel_package_address rpa on a.id = rpa.id_address
                            INNER JOIN package p ON rpa.id_package = p.id
                            INNER JOIN info i on a.id_info = i.id
                            where p.id = ? AND i.name = ?`;

const errorMessage = "Data access error";

async function insert(Address){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [ Address.idInfo, Address.number,Address.street, Address.additionalAddress, Address.zipCode, Address.city, Address.country]);
        const id = idCreated.insertId;
        const [result] = await getByIdWithInfo(id)
        return result;
    }catch (error) {
        log.error("Error adressDAO insert : " + error);
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
        log.error("Error addressDAO delete : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByIdWithInfo(id){
    let con = null;
    try {
        con = await database.getConnection();
        const [rows] = await con.execute(SELECT_BY_ID_INFO, [id]);
        return rows;
    } catch (error) {
        log.error("Error addressDAO selectByWithInfo : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getAll(){

}

async function insertRelation(idPackage, idAddress){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_INSERT_RELATION, [idPackage, idAddress]);
    }catch (error) {
        log.error("Error addressDAO insertRelation : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function removeRelation(idPackage, idAddress){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_REMOVE_RELATION, [idPackage, idAddress])
    }catch (error) {
        log.error("Error addressDAO removeRelation : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByPackage(id, info){
    let con = null;
    try{
        con = await database.getConnection();
        const [address] = await con.execute(SELECT_BY_PACKAGE, [id, info]);
        return address;
    }catch (error) {
        log.error("Error addressDAO insertRelation : " + error);
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
    insertRelation,
    getByIdWithInfo,
    getByPackage,
    removeRelation
}
