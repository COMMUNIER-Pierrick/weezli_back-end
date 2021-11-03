const database = require("../tools/database");
const log = require("../../../log/logger");
const userDAO = require("./userDAO");
const announceDAO = require("./announceDAO");
const statusDAO = require("./statusDAO");
const Order = require("../../models/Order");
const propositionDAO = require("./propositionDAO");

const SQL_INSERT = `INSERT INTO orders SET code_validated = ?, id_status = ?, id_announce = ?, date_order = ?, qr_code = ?`;

const SQL_DELETE = `DELETE FROM orders WHERE id = ?`

const SQL_UPDATE = `UPDATE orders SET id_status = ? WHERE id =?`;

const SELECT_BY_ID = 'SELECT * FROM orders WHERE id = ?';

const SELECT_ORDER_BY_USER_AND_STATUS = `SELECT o.id, o.code_validated, o.id_status, o.id_announce, o.date_order, o.qr_code, s.name
                                         FROM orders o
                                         INNER JOIN status s ON o.id_status = s.id
                                         INNER JOIN announce a ON o.id_announce = a.id
                                         INNER JOIN proposition p ON a.id = p.id_announce
                                         INNER JOIN rel_user_announce rua on a.id = rua.id_announce
                                         INNER JOIN users u on rua.id_user = u.id
                                         WHERE p.id_user = ? OR u.id = ? AND s.id = ?`;

const SELECT_ORDER_BY_USER = `SELECT o.id, o.code_validated, o.id_status, o.id_announce, o.date_order, o.qr_code
                              FROM orders o
                              INNER JOIN announce a ON o.id_announce = a.id
                              INNER JOIN proposition p ON a.id = p.id_announce
                              INNER JOIN rel_user_announce rua on a.id = rua.id_announce
                              INNER JOIN users u on rua.id_user = u.id
                              WHERE p.id_user = ? OR u.id = ?`;

const errorMessage = "Data access error";

async function insert(newOrder) {
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] =  await con.execute(SQL_INSERT, [newOrder.codeValidated.toString(), newOrder.status.id, newOrder.announce.id, newOrder.date_order, newOrder.qr_code]);
        const id = idCreated.insertId;
        return await getById(id);
    }catch (error) {
        log.error("Error orderDAO insert : " + error);
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
        log.error("Error orderDAO remove : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function updateStatus(order){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [order.id_status, order.id]);
    }catch (error) {
        log.error("Error orderDAO update : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getById (id) {
    let con = null;
    try {
        con = await database.getConnection();
        const [order] = await con.execute(SELECT_BY_ID, [id]);
        let newOrder = new Order(order[0].id, order[0].code_validated, order[0].id_status, order[0].id_announce, order[0].date_order, order[0].qr_code);
        return newOrder;
    } catch (error) {
        log.error("Error orderDAO selectById : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getOrdersByUserAndStatus (idUserP, idUserU, id_status) {
    let con = null;
    try {
        con = await database.getConnection();
        const [orders] = await con.execute(SELECT_ORDER_BY_USER_AND_STATUS, [idUserP, idUserU, id_status]);
        let listOrdersSender = [];
        for(let i = 0; i < orders.length; i++) {
            let newOrder = new Order(orders[i].id, orders[i].code_validated, orders[i].id_status, orders[i].id_announce, orders[i].date_order, orders[i].qr_code);
            listOrdersSender.push({"Order": newOrder});
        }
        return listOrdersSender;
    } catch (error) {
        log.error("Error orderDAO getOrdersByUserAndStatus : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getOrdersByUser (idUserP, idUserU) {
    let con = null;
    try {
        con = await database.getConnection();
        const [orders] = await con.execute(SELECT_ORDER_BY_USER, [idUserP, idUserU]);
        let listOrdersSender = [];
        for(let i = 0; i < orders.length; i++) {
            let newOrder = new Order(orders[i].id, orders[i].code_validated, orders[i].id_status, orders[i].id_announce, orders[i].date_order, orders[i].qr_code);
            listOrdersSender.push({"Order": newOrder});
        }
        return listOrdersSender;
    } catch (error) {
        log.error("Error orderDAO getOrdersByUser : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

module.exports = {
    insert,
    remove,
    updateStatus,
    getById,
    getOrdersByUserAndStatus,
    getOrdersByUser
};






