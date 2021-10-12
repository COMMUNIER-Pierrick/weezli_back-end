const log = require('../log/logger');
let Order = require('../services/models/Order');
const orderDAO = require("../services/database/dao/orderDAO");

const insert = async (req, res) => {

    const { announce, status, dateOrder, transporter, qrCode} = req.body.Order;

    const order = Order.OrderInsert(status, announce, dateOrder, transporter, qrCode);
    const result = await orderDAO.insert(order);
    const message = "La commande a bien été créée";
    return res.status(200).send({"Message": message, "Order": result});
};

module.exports = {
    insert,
};


