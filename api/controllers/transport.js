const transportDAO = require('../services/database/dao/transportDAO');
const log = require('../log/logger');
let Transport = require('../services/models/Transport');

const getAll = async (req, res) => {
    let results = null;
    results = await transportDAO.getAll();
    res.status(200).send({"transports": results});
}

const insert = async (req, res) => {
    let transport = new Transport(req.body.name);
    const result = await transportDAO.insert(transport);
    const message = "le moyen de transport a bien été créé.";
    return res.status(200).send({"message": message, "transport": result});
}

const update = async (req, res) => {
    const {id} = req.params;
    const transport = new Transport(req.body.name);
    let result = await transportDAO.update(transport, id);
    const message = "le moyen de transport a bien été mis à jour";
    return res.status(200).send({"message": message, "transport": result});
}

const getById = async (req, res) => {
    const {id} = req.params;
    let result = null;
    result = await transportDAO.getById(id);
    res.status(200).send({"transport": result});
}

const remove = async (req, res) => {
    const {id} = req.params;
    await transportDAO.remove({id});
    let message = "Le moyen de transport a bien été supprimé";
    return res.status(200).send({"message": message});
}

module.exports = {
    insert,
    remove,
    update,
    getAll,
    getById
};
