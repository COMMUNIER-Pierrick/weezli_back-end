const database = require("../tools/database");
const log = require("../../../log/logger");
const userDAO = require("./userDAO");
const announceDAO = require("./announceDAO");
const statusDAO = require("./statusDAO");
const finalPriceDAO = require("./finalPriceDAO");
const Order = require("../../models/Order");

const SQL_INSERT = `INSERT INTO orders SET code_validated = ?, id_status = ?, id_announce = ?, date_order = ?, id_buyer = ?, qr_code = ?, id_final_price = ?`;
const SELECT_BY_ID = 'SELECT * FROM orders WHERE id = ?';
const SELECT_ORDER_SENDER = 'SELECT * FROM orders where id_buyer = ?';
const SELECT_ORDER_CARRIER = 'SELECT o.id, o.code_validated, o.id_status, o.id_announce, o.date_order, o.id_buyer, o.qr_code, o.id_final_price FROM orders o INNER JOIN final_price f on o.id_final_price = f.id where f.id_user = ?';

const errorMessage = "Data access error";

async function insert(newOrder) {
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] =  await con.execute(SQL_INSERT, [newOrder.codeValidated.toString(), newOrder.status.id, newOrder.announce.id, newOrder.dateOrder, newOrder.buyer.id, newOrder.qrCode, newOrder.finalPrice.id]);
        const id = idCreated.insertId;
        //Insertion de l'idOrder dans l'annonce
        let announceId = newOrder.announce.id;
        await announceDAO.createOrder(id, announceId);
        // Récupération de l'order créé.
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

async function getById (id) {
    let con = null;
    try {
        con = await database.getConnection();
        const [order] = await con.execute(SELECT_BY_ID, [id]);
        let announceId = order[0].id_announce;
        const Announce = await announceDAO.getById(announceId);
        let userId = order[0].id_buyer;
        const user = await userDAO.getById(userId);
        let statusId = order[0].id_status;
        const status = await statusDAO.getById(statusId);
        let finalPriceId = order[0].id_final_price;
        const finalPrice = await finalPriceDAO.getById(finalPriceId);
        let newOrder = Order.OrderId(order[0].id, order[0].code_validated, status, Announce, order[0].date_order, user, order[0].qr_code, finalPrice);
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

async function getOrdersUserCarrier (id) {
    let con = null;
    try {
        con = await database.getConnection();
        const [orders] = await con.execute(SELECT_ORDER_CARRIER, [id]);
        let listOrdersCarrier = [];
        for(let i = 0; i < orders.length; i++) {
            let announceId = orders[i].id_announce;
            const Announce = await announceDAO.getById(announceId);
            let userId = orders[i].id_buyer;
            const user = await userDAO.getById(userId);
            let statusId = orders[i].id_status;
            const status = await statusDAO.getById(statusId);
            let finalPriceId = orders[i].id_final_price;
            const finalPrice = await finalPriceDAO.getById(finalPriceId);
            let newOrder = Order.OrderId(orders[i].id, orders[i].code_validated, status, Announce, orders[i].date_order, user, orders[i].qr_code, finalPrice);
            listOrdersCarrier.push({"Order": newOrder});
        }
        return listOrdersCarrier;
    } catch (error) {
        log.error("Error orderDAO getOrdersUserCarrier : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getOrdersUserSender (id) {
    let con = null;
    try {
        con = await database.getConnection();
        const [orders] = await con.execute(SELECT_ORDER_SENDER, [id]);
        let listOrdersSender = [];
        for(let i = 0; i < orders.length; i++) {
            let announceId = orders[i].id_announce;
            const Announce = await announceDAO.getById(announceId);
            let userId = orders[i].id_buyer;
            const user = await userDAO.getById(userId);
            let statusId = orders[i].id_status;
            const status = await statusDAO.getById(statusId);
            let finalPriceId = orders[i].id_final_price;
            const finalPrice = await finalPriceDAO.getById(finalPriceId);
            let newOrder = Order.OrderId(orders[i].id, orders[i].code_validated, status, Announce, orders[i].date_order, user, orders[i].qr_code, finalPrice);
            listOrdersSender.push({"Order": newOrder});
        }
        return listOrdersSender;
    } catch (error) {
        log.error("Error orderDAO getOrdersUserSender : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

module.exports = {
    insert,
    getById,
    getOrdersUserCarrier,
    getOrdersUserSender,
};






