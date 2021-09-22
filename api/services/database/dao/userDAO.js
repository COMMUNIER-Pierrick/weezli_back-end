const database = require('../tools/database');
const log = require('../../../log/logger');
const paymentDAO = require("./paymentDAO");
const checkDAO = require("./checkUserDAO");
const choiceDAO = require("./choiceDAO");
const Payment = require("../../models/Payment");
const CheckUser = require("../../models/CheckUser");
const Choice = require("../../models/Choice");
const User = require("../../models/User");

const errorMessage = "Data access error";

const SQL_INSERT_RELATION_ANNOUNCE = `INSERT INTO rel_user_announce SET id_announce = ?, id_user = ?`;
const SQL_INSERT = `INSERT INTO users SET firstname = ?, lastname = ?, username = ?, password = ?, email = ?, date_of_birthday = ?, id_payment = ?, id_choice = ?, id_check = ?`;
const SQL_REMOVE_RELATION = `DELETE FROM rel_user_announce WHERE id_announce = ? AND id_user = ?`
const SQL_UPDATE_PROFILE = `UPDATE users SET firstname = ?, lastname = ?, email = ?, phone = ?, url_profile_img = ? WHERE id = ?`;
const SQL_UPDATE_CHOICE = `UPDATE users SET id_choice = ?, choice_date_started = ?, choice_date_end = ? WHERE id = ?`;
const SELECT_BY_ID = `SELECT * FROM users u WHERE id = ? `;
const SELECT_CONTROL_IDENTIFIER = `SELECT id, email, username FROM users WHERE email = ? OR username = ?`;
const SELECT_ID = `SELECT id FROM users WHERE email = ?`;
const SELECT_FOR_ANNOUNCE_BY_ANNOUNCE = `SELECT u.id, u.firstname, u.lastname, u.average_opinion 
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
        const idPayment = await paymentDAO.insert();
        const idCheck = await checkDAO.insert();
        const [idCreated] =  await con.execute(SQL_INSERT, [newUser.firstname, newUser.lastname, newUser.username, newUser.password, newUser.email, newUser.dateOfBirthday, idPayment, 1, idCheck]);
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

async function getByLogin(email){
    let con = null;
    try{
        con = await database.getConnection();
        const [userId] = await con.execute(SELECT_ID,[email]);
        const id = userId[0].id;
        const user = await getById(id);
        return user;
    }catch (error) {
        log.error("Error userDAO login : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function remove(){

}

async function update(user, id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE_PROFILE, [user.firstname, user.lastname, user.email, user.phone, user.url_profile_img, id]);
        await checkDAO.update(user.check.imgIdentity, user.check.id);
        const newUser = await getById(id);
        return newUser;
    }catch (error) {
        log.error("Error userDAO update : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function updatePayment(){
    let con = null;
    try{

    }catch (error) {
        log.error("Error userDAO update : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function updateChoiceUser(user, id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE_CHOICE, [user.Choice.id, user.choiceDateStarted, user.choiceDateEnd, id]);
        const userUpdate = await getById(id);
        return userUpdate;
    }catch (error) {
        log.error("Error userDAO update : " + error);
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
        const [user] = await con.execute(SELECT_BY_ID, [id]);
        const payment = await paymentDAO.getById(user[0].id_payment);
        const check = await checkDAO.getById(user[0].id_check);
        const choice = await choiceDAO.getById(user[0].id_choice);
        const newPayment = new Payment(payment[0].id, payment[0].name, payment[0].iban, payment[0].number_card, payment[0].expired_date_card);
        const newCheck = new CheckUser(check[0].id, check[0].status_phone, check[0].status_mail, check[0].status_identity, check[0].img_identity);
        const newChoice = new Choice(choice[0].id, choice[0].name, choice[0].description, choice[0].price);
        const newUser = new User(user[0].id, user[0].firstname, user[0].lastname, user[0].username, user[0].password, user[0].email, user[0].phone, user[0].date_of_birthday, user[0].active, user[0].url_profile_img, user[0].average_opinion, newPayment, newChoice, newCheck, user[0].choice_date_started, user[0].choice_date_end);
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

async function getControlUser(email, username){
    let con = null;
    try{
        con = await database.getConnection();
        const [users] = await con.execute(SELECT_CONTROL_IDENTIFIER, [email, username]);
        return users;
    }catch (error) {
        log.error("Error userDAO getControl : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

module.exports = {
    getUserForAnnounceByAnnounce,
    insertRelation,
    getById,
    insert,
    update,
    updateChoiceUser,
    updatePayment,
    remove,
    getByLogin,
    removeRelationAnnounce,
    getControlUser
}
