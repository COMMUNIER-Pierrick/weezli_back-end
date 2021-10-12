const database = require("../tools/database");
const log = require("../../../log/logger");
const userDAO = require("./userDAO");
const announceDAO = require("./announceDAO");
const statusDAO = require("./announceDAO");
const Order = require("../../models/Order");

const SQL_INSERT = `INSERT INTO orders SET code_validated = ?, id_status = ?, id_announce = ?, date_order = ?, id_transporter = ?, qr_code = ?`;
const SELECT_BY_ID = 'SELECT * FROM orders WHERE id = ?';

const errorMessage = "Data access error";

async function insert(newOrder) {
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] =  await con.execute(SQL_INSERT, [newOrder.codeValidated.toString(), newOrder.status.id, newOrder.announce.id, newOrder.dateOrder, newOrder.transporter.id, newOrder.qrCode]);
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
        const announce = await announceDAO.getById(announceId);
        let userId = order[0].id_transporter;
        const user = await userDAO.getById(userId);
        let statusId = order [0].id_status;
        const status = await statusDAO.getById(statusId);
        return Order.OrderId(order[0].id, order[0].codeValidated, status, announce, order[0].dateOrder, user, order[0].qrCode);
    } catch (error) {
        log.error("Error orderDAO selectById : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

module.exports = {
    insert,
    getById
};






