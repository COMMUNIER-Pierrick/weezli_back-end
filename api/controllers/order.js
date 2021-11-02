const log = require('../log/logger');
let Order = require('../services/models/Order');
const orderDAO = require("../services/database/dao/orderDAO");

const insert = async (req, res) => {

    const { announce, status, dateOrder, qrCode} = req.body.Order;

    const order = Order.OrderInsert(status, announce, dateOrder, qrCode);
    const result = await orderDAO.insert(order);
    const message = "La commande a bien été créée";
    return res.status(200).send({"Message": message, "Order": result});
};

const update = async (req, res) => {
    const { order } = req.params;
    await orderDAO.update(order.id_status, order.id);
    const message = "La commande a bien été mis à jour.";
    res.status(200).send({ "Message": message });
};

const remove = async (req, res) => {
    const { id } = req.params;
    await orderDAO.remove(id);
    const message = "Suppression réussie.";
    res.status(200).send({ "Message": message });
};

const getById = async (req, res) => {

    const {id} = req.params;
    const order = await orderDAO.getById(id);
    res.status(200).send( {"Order": order} );
};

const getOrdersByUserAndStatus = async (req, res) => {

    const {idUserP, idUserU, id_status} = req.params;
    const orders = await orderDAO.getOrdersByUserAndStatus(idUserP, idUserU, id_status);
    res.status(200).send( {"Orders": orders} );
};

const getOrdersByUser = async (req, res) => {

    const {idUserP, idUserU} = req.params;
    const orders = await orderDAO.getOrdersByUser(idUserP, idUserU);
    res.status(200).send( {"Orders": orders} );
};

module.exports = {
    insert,
    update,
    remove,
    getById,
    getOrdersByUserAndStatus,
    getOrdersByUser
};


