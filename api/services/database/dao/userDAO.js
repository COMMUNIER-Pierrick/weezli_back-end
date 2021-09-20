const database = require('../tools/database');
const log = require('../../../log/logger');
const ribDAO = require("./ribDAO");
const checkDAO = require("./checkUserDAO");
const choiceDAO = require("./choiceDAO");
const Rib = require("../../models/Rib");
const CheckUser = require("../../models/CheckUser");
const Choice = require("../../models/Choice");
const User = require("../../models/User");

const errorMessage = "Data access error";

const SQL_INSERT_RELATION_ANNOUNCE = `INSERT INTO rel_user_announce SET id_announce = ?, id_user = ?`;
const SQL_INSERT = `INSERT INTO users SET firstname = ?, lastname = ?, username = ?, password = ?, email = ?, id_rib = ?, id_choice = ?, id_check = ?`;
const SQL_REMOVE_RELATION = `DELETE FROM rel_user_announce WHERE id_announce = ? AND id_user = ?`
const SELECT_BY_ID = `SELECT u.id, u.firstname, u.lastname, u.username, u.password, u.email, u.phone, u.active, u.url_profile_img, u.average_opinion, 
                        u.id_rib, u.id_choice, u.id_check FROM users u WHERE id = ? `;
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

async function removeRelationAnnounce(idAnnounce, idUser){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_REMOVE_RELATION, [idAnnounce, idUser])
    }catch (error) {
        log.error("Error addressDAO removeRelation : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insert(newUser){
    let con = null;
    try{
        con = await database.getConnection();
        const idRib = await ribDAO.insert();
        const idCheck = await checkDAO.insert();
        /* A Modifier choice: 1 pas 4*/
        const idCreated = con.execute(SQL_INSERT, newUser.firstname, newUser.lastname, newUser.username, newUser.password, newUser.email, idRib, 4, idCheck);
        const id = idCreated.insertId;
        const user = await getById(id);
        return user;
    }catch (error) {
        log.error("Error userDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByLogin(email, password){

}

async function remove(){

}

async function update(){

}

async function getById(id){
    let con = null;
    try{
        con = await database.getConnection();
        const [user] = await con.execute(SELECT_BY_ID, [id]);
        const rib = await ribDAO.getById(user[0].id_rib);
        const check = await checkDAO.getById(user[0].id_check);
        const choice = await choiceDAO.getById(user[0].id_choice);
        const newRib = new Rib(rib[0].id, rib[0].name, rib[0].iban);
        console.log(newRib)
        const newCheck = new CheckUser(check[0].id, check[0].status_phone, check[0].status_mail, check[0].status_identity, check[0].img_url);
        const newChoice = new Choice(choice[0].id, choice[0].name, choice[0].description, choice[0].price);
        const newUser = new User(user[0].id, user[0].firstname, user[0].lastname, user[0].username, user[0].password, user[0].email, user[0].phone, user[0].active, user[0].url_profile_img, user[0].average_opinion, newRib, newChoice, newCheck);
        console.log(newUser);
        return newUser;

    }catch (error) {
        log.error("Error userDAO getById : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getControlUser(email){

}

module.exports = {
    getUserForAnnounceByAnnounce,
    insertRelation,
    getById,
    insert,
    update,
    remove,
    getByLogin,
    removeRelationAnnounce,
    getControlUser
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
