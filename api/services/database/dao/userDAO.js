const database = require('../tools/database');
const log = require('../../../log/logger');
const paymentDAO = require("./paymentDAO");
const checkDAO = require("./checkUserDAO");
const Payment = require("../../models/Payment");
const CheckUser = require("../../models/CheckUser");
const User = require("../../models/User");
const addressDAO = require("./addressDAO");

const errorMessage = "Data access error";

const SQL_INSERT_RELATION_ANNOUNCE = `INSERT INTO rel_user_announce SET id_announce = ?, id_user = ?`;
const SQL_INSERT = `INSERT INTO users SET firstname = ?, lastname = ?, username = ?, password = ?, email = ?, date_of_birthday = ?, id_payment = ?, id_check = ?, id_address = ?`;
const SQL_REMOVE_RELATION = `DELETE FROM rel_user_announce WHERE id_announce = ? AND id_user = ?`
const SQL_REMOVE_USER = `DELETE FROM users WHERE id = ?`;
const SQL_UPDATE_PROFILE = `UPDATE users SET firstname = ?, lastname = ?, email = ?, phone = ?, url_profile_img = ? WHERE id = ?`;
const SQL_UPDATE_AVERAGE_OPINION = `UPDATE users SET average_opinion = ? WHERE id = ?`;
const SELECT_BY_ID = `SELECT * FROM users WHERE id = ? `;
const SELECT_CONTROL_IDENTIFIER = `SELECT id, email, username FROM users WHERE email = ? OR username = ?`;
const SELECT_ID = `SELECT id FROM users WHERE email = ?`;
const SELECT_FOR_ANNOUNCE_BY_ANNOUNCE = `SELECT *
                                        FROM users u 
                                        INNER JOIN rel_user_announce rua on u.id = rua.id_user
                                        WHERE rua.id_announce = ?`;

async function getUserForAnnounceByAnnounce(id){
    let con = null;
    try{
        con = await database.getConnection();
        const [user] = await con.execute(SELECT_FOR_ANNOUNCE_BY_ANNOUNCE , [id]);
        const check = await checkDAO.getById(user[0].id_check);
        const newCheck = new CheckUser(check[0].id, check[0].status_phone, check[0].status_mail, check[0].status_identity, check[0].img_identity, check[0].status, check[0].confirm_code);
        const payment = await paymentDAO.getById(user[0].id_payment);
        const newPayment = new Payment(payment[0].id, payment[0].name, payment[0].iban, payment[0].number_card, payment[0].expired_date_card);
        const address = await addressDAO.getByIdWithInfo(user[0].id_address);
        const newUser = new User(user[0].id, user[0].firstname, user[0].lastname, user[0].username, user[0].password, user[0].email, user[0].phone, user[0].date_of_birthday, user[0].active, user[0].url_profile_img, user[0].average_opinion, newPayment, newCheck, address);
        return newUser;
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
        const address = await addressDAO.insert(newUser.address);
        const [idCreated] =  await con.execute(SQL_INSERT, [newUser.firstname, newUser.lastname, newUser.username, newUser.password, newUser.email, newUser.dateOfBirthday, idPayment, idCheck, address.id]);
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
        if(!userId.length){
            return null;
        }
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

async function remove(id){
    let con = null
    try{
        con = await database.getConnection();
        await con.execute(SQL_REMOVE_USER, [id]);
    }catch (error) {
        log.error("Error userDAO remove : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(User,filename, filecheck, id){
    let con = null;
    let file = '';
    let fileForCheck = '';
    if(filename){
        file = filename;
    }
    if(filecheck){
        fileForCheck = filecheck;
    }
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE_PROFILE, [User.firstname, User.lastname, User.email, User.phone, file, id]);
        await checkDAO.update(fileForCheck, User.check.id);
        await addressDAO.update(User.address);
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

async function updateAverageOpinion(user){

    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE_AVERAGE_OPINION, [user.average_opinion, user.id]);
        const newUser = await getById(user.id);
        return newUser;
    }catch (error) {
        log.error("Error userDAO updateAverageOpinion : " + error);
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
        log.error("Error userDAO updatePayment : " + error);
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
        const newPayment = new Payment(payment[0].id, payment[0].name, payment[0].iban, payment[0].number_card, payment[0].expired_date_card);
        const newCheck = new CheckUser(check[0].id, check[0].status_phone, check[0].status_mail, check[0].status_identity, check[0].img_identity, check[0].status, check[0].confirm_code);
        const address = await addressDAO.getByIdWithInfo(user[0].id_address);
        const newUser = new User(user[0].id, user[0].firstname, user[0].lastname, user[0].username, user[0].password, user[0].email, user[0].phone, user[0].date_of_birthday, user[0].active, user[0].url_profile_img, user[0].average_opinion, newPayment, newCheck, address);
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

async function getByIdForUser(id){
    /*uniquement pout l'utilisateur*/
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
    remove,
    getByLogin,
    removeRelationAnnounce,
    getControlUser,
    updateAverageOpinion
};

/*
* {
    "UserDAO": {
        "firstname": "vinc",
        "lastname": "dev",
        "username": "vincdev",
        "password": "Azerty123!",
        "email": "vinc.tigra@gmail.com",
        "dateOfBirthday": "1980-12-10T00:00:00",
        "address" : {
            "idInfo": 3,
            "number" : 36,
            "street": "rue cr??billion",
            "additionalAddress" : "",
            "zipCode": 44000,
            "city" : "Nantes",
            "country": "France"
        }
    }
}
* */
