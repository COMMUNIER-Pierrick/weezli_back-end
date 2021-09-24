const sizeDAO = require('../services/database/dao/sizeDAO');
const log = require('../log/logger');
let Size = require('../services/models/Size');

const getAll = async (req, res) => {
    const sizes = await sizeDAO.getAll();
    res.status(200).send({"Sizes": sizes});
}

const insert = async (req, res) => {
    const size = new Size(req.body.name);
    const result = await sizeDAO.insert(size);
    const message = "la taille a bien été créé";
    return res.status(200).send({"Message": message, "Size": result});
}

const update = async (req, res) => {
    const {id} = req.params;
    const size = new Size(req.body.name);
    const result = await sizeDAO.update(size, id);
    const message = "la taille a bien été modifié";
    res.status(200).send({"Message": message, "Size": result});
}

const getById = async (req, res) => {
     const {id} = req.params;
     const size = await sizeDAO.getById({id});
     res.status(200).send({"Size": size});
}

const remove = async (req, res) => {
    const {id} = req.params;
    await sizeDAO.remove({id});
    const message = "la taille a bien été supprimé";
    res.status(200).send({"Message": message});
}

module.exports = {
    insert,
    remove,
    update,
    getAll,
    getById
};
