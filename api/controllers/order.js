const log = require('../log/logger');
let Order = require('../services/models/Order');
const orderDAO = require("../services/database/dao/orderDAO");

const insert = async (req, res) => {

    const { announce, status, dateOrder, transporter, qrCode, finalPrice} = req.body.Order;

    const order = Order.OrderInsert(status, announce, dateOrder, transporter, qrCode, finalPrice);
    const result = await orderDAO.insert(order);
    const message = "La commande a bien été créée";
    return res.status(200).send({"Message": message, "Order": result});
};

const getById = async (req, res) => {

    const {id} = req.params;
    const order = await orderDAO.getById(id);
    res.status(200).send( {"Order": order} );
};

const getOrdersUserCarrier = async (req, res) => {

    const {id} = req.params;
    const orders = await orderDAO.getOrdersUserCarrier(id);
    res.status(200).send( {"Orders": orders} );
};

const getOrdersUserSender = async (req, res) => {

    const {id} = req.params;
    const orders = await orderDAO.getOrdersUserSender(id);
    res.status(200).send( {"Orders": orders} );
};

module.exports = {
    insert,
    getById,
    getOrdersUserCarrier,
    getOrdersUserSender
};


