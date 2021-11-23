const log = require('../log/logger');
const Order = require('../services/models/Order');
const orderDAO = require("../services/database/dao/orderDAO");
const opinionController = require("./opinion");

/*L'insert sera appeler update de proposition et apperla directement la dao sans passer par le controler*/
const insert = async (req, res) => {
    const {Order} = req.body;
    console.log(Order);
    //let codeValidated = codeValidatedRandom()
    const order = Order.OrderInsert(Order.codeValidated, Order.id_status, Order.id_announce, Order.dateOrder);
    const result = await orderDAO.insert(order);
    //const message = "La commande a bien été créée";
    //console.log(result);
    return res.status(200).send({"Order": result});
};

const updateStatus = async (req, res) => {
    const { order } = req.body;
    await orderDAO.updateStatus(order.id_status, order.id);
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
    const opinions = await opinionController.getByOrder(order.id);
    res.status(200).send( {"Order": order, "Opinions" : opinions} );
};

const getOrdersByUserStatusAndType = async (req, res) => {

    const {id} = req.params;
    const orders = await orderDAO.getOrdersByUserStatusAndType(id);
    res.status(200).send( {"Orders": orders} );
};

const getOrdersByUserAndStatus = async (req, res) => {

    const {id, id_status} = req.params;
    const orders = await orderDAO.getOrdersByUserAndStatus(id, id_status);
    res.status(200).send( {"Orders": orders} );
};

const getOrdersByUser = async (req, res) => {

    const {id, id_status_proposition} = req.params;
    const orders = await orderDAO.getOrdersByUser(id, id_status_proposition);
    res.status(200).send( {"Orders": orders} );
};

module.exports = {
    insert,
    updateStatus,
    remove,
    getById,
    getOrdersByUserStatusAndType,
    getOrdersByUserAndStatus,
    getOrdersByUser,
    codeValidatedRandom
};


function codeValidatedRandom() {
    let longueur = 6,
        str = '1234567890',
        result = '',
        number = '1234567890',
        total = '' + str;

    result = str[Math.floor(Math.random() * str.length)];
    total += str.toUpperCase();
    total += number;

    for (let d = 1; d < longueur; d++) {
        result += total[Math.floor(Math.random() * total.length)];
    }
    return result;
}

