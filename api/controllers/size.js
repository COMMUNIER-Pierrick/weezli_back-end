const sizeDAO = require('../services/database/dao/sizeDAO');
const log = require('../log/logger');
let Size = require('../services/models/Size');

const getAll = async (req, res) => {
    let results = null;
    results = await sizeDAO.getAll();
    res.status(200).send({"sizes": results});
}

const insert = async (req, res) => {
    let size = new Size(req.body.name);
    const result = await sizeDAO.insert(size);
    const message = "la taille a bien été créé";
    return res.status(200).send({"message": message, "size": result});
}

const update = async (req, res) => {
    let {id} = req.params;
    let size = new Size(req.body.name);
    let result = await sizeDAO.update(size, id);
    let message = "la taille a bien été modifié";
    res.status(200).send({"message": message, "size": result});
}

const getById = async (req, res) => {
     const {id} = req.params;
     let result = null;
     result = await sizeDAO.getById({id});
     res.status(200).send({"size": result});
}

const remove = async (req, res) => {
    const {id} = req.params;
    await sizeDAO.remove({id});
    let message = "la taille a bien été supprimé";
    res.status(200).send({"message": message});
}

module.exports = {
    insert,
    remove,
    update,
    getAll,
    getById
};
