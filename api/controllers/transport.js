const transportDAO = require('../services/database/dao/transportDAO');
const log = require('../log/logger');
let Transport = require('../services/models/Transport');

const getAll = async (req, res) => {
    const transport = await transportDAO.getAll();
    res.status(200).send({"Transports": transport});
}

const insert = async (req, res) => {
    const transport = new Transport(req.body.name);
    const result = await transportDAO.insert(transport);
    const message = "le moyen de transport a bien été créé.";
    return res.status(200).send({"Message": message, "Transport": result});
}

const update = async (req, res) => {
    const {id} = req.params;
    const transport = new Transport(req.body.name);
    const result = await transportDAO.update(transport, id);
    const message = "le moyen de transport a bien été mis à jour";
    return res.status(200).send({"Message": message, "Transport": result});
}

const getById = async (req, res) => {
    const {id} = req.params;
    const transport = await transportDAO.getById(id);
    res.status(200).send({"Transport": transport});
}

const remove = async (req, res) => {
    const {id} = req.params;
    await transportDAO.remove({id});
    const message = "Le moyen de transport a bien été supprimé";
    return res.status(200).send({"Message": message});
}

module.exports = {
    insert,
    remove,
    update,
    getAll,
    getById
};
