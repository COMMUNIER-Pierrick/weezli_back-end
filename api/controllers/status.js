const statusDAO = require('../services/database/dao/statusDAO');
const log = require('../log/logger');
let Status = require('../services/models/Status');

const getAll = async (req, res) => {
    let results = null;
    results = await statusDAO.getAll();
    res.status(200).send({"status": results});
}

const insert = async (req, res) => {
    let size = new Status(req.body.name);
    const result = await statusDAO.insert(size);
    const message = "Le status a bien été créé.";
    return res.status(200).send({"message": message , "status": result});
}

const update = async (req, res) => {
    const {id} = req.params;
    let statusName = new Status(req.body.name);
    let result = await statusDAO.update(statusName, id);
    let message = "Le status a bien été modifié.";
    res.status(200).send({"message": message , "status": result});
}

const getById = async (req, res) => {
    const {id} = req.params;
    let result = null;
    result = await statusDAO.getById({id});
    res.status(200).send({"status": result});
}

const remove = async (req, res) => {
    const {id} = req.params;
    await statusDAO.remove({id});
    let message = "Le status a bien été supprimée";
    res.status(200).send({"message": message});
}

module.exports = {
    insert,
    remove,
    update,
    getAll,
    getById
};
