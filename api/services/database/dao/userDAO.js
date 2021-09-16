const database = require('../tools/database');
const log = require('../../../log/logger');

const errorMessage = "Data access error";

const SQL_INSERT_RELATION_ANNOUNCE = `INSERT INTO rel_user_announce SET id_announce = ?, id_user = ?`;
const SELECT_FOR_ANNOUNCE_BY_ANNOUNCE = `SELECT u.id, u.firstname, u.lastname 
                                        FROM users u 
                                        INNER JOIN rel_user_announce rua on u.id = rua.id_user
                                        WHERE rua.id_announce = ?`;

async function getUserForAnnounceByAnnounce(id){
    let con = null;
    try{
        con = await database.getConnection();
        const [user] = await con.execute(SELECT_FOR_ANNOUNCE_BY_ANNOUNCE , [id]);
        return user;
    } catch (error) {
        log.error("Error userDAO selectUserforannouncebyannounce : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insertRelation(idAnnounce, idUser){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_INSERT_RELATION_ANNOUNCE, [idAnnounce, idUser]);
    }catch (error) {
        log.error("Error userDAO insertRelation announce : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function removeRelationAnnounce(idPackage, idSize){

}


async function insert(){

}

async function login(){

}

async function remove(){

}

async function update(){

}

async function getById(){

}


module.exports = {
    getUserForAnnounceByAnnounce,
    insertRelation,
    getById,
    insert,
    update,
    remove,
    login,
    removeRelationAnnounce
}

/*
const SQL_SELECT_BY_IDENTIFIER =
    `SELECT
    u.id, u.firstname, u.lastname, u.username, u.password, u.email, u.phone, u.url_profile_img, u.average_opinion, u.active,
    r.iban,
    co.name, co.description, co.price,
    ch.status_phone, ch.status_mail, ch.status_identity
    FROM users u
    INNER JOIN choice co ON u.id = co.id
    INNER JOIN check ch ON u.id = ch.id
    INNER JOIN rib r ON u.id = r.id
    WHERE u.email = ? OR u.username = ? AND u.password = ?`;


async function selectOneUser(identifier) {
    let con = null;
    try {
        con = await database.getConnection();
        const [user] = await con.execute(SQL_SELECT_BY_IDENTIFIER, [identifier, identifier]);
        return user;
    } catch (error) {
        log.error("Error userDAO selectOneUser : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}
*/
