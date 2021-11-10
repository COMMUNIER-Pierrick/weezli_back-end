const statusDAO = require('../services/database/dao/statusDAO');
const log = require('../log/logger');
let Status = require('../services/models/Status');

const getAll = async (req, res) => {
    const status = await statusDAO.getAll();
    res.status(200).send({"Status": status});
}

const insert = async (req, res) => {
    const name = new Status(req.body.name);
    const status = await statusDAO.insert(name);
    const message = "Le status a bien été créé.";
    return res.status(200).send({"Message": message , "Status": status});
}

const update = async (req, res) => {
    const {id} = req.params;
    const statusName = new Status(req.body.name);
    const status = await statusDAO.update(statusName, id);
    const message = "Le status a bien été modifié.";
    res.status(200).send({"Message": message , "Status": status});
}

const getById = async (req, res) => {
    const {id} = req.params;
    const status = await statusDAO.getById(id);
    res.status(200).send({"Status": status});
}

const remove = async (req, res) => {
    const {id} = req.params;
    await statusDAO.remove(id);
    const message = "Le status a bien été supprimée";
    res.status(200).send({"Message": message});
}

module.exports = {
    insert,
    remove,
    update,
    getAll,
    getById
};
