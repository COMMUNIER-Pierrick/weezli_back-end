const sizeDAO = require('../services/database/dao/sizeDAO');
const log = require('../log/logger');
let Size = require('../services/models/Size');
const fileDAO = require("../services/database/dao/fileDAO");
const transportDAO = require("../services/database/dao/transportDAO");

const getAll = async (req, res) => {
    const sizes = await sizeDAO.getAll();
    res.status(200).send({"Sizes": sizes});
}

const insert = async (req, res) => {
    const name = req.body.name;
    let file = '';
    if(req.file){
        file = req.file.filename;
        await fileDAO.insert(file);
    }
    const result = await sizeDAO.insert(name, file);
    const message = "la taille a bien été créé";
    return res.status(200).send({"Message": message, "Size": result});
}

const update = async (req, res) => {
    const {id} = req.params;
    const name = req.body.name;
    let file = '';
    const [size] = await sizeDAO.getById(id);
    if(req.file){
        file = req.file.filename
        if(size.filename !== file){
            if(size.filename !== ''){
                await fileDAO.remove(size.filename);
            }
            await fileDAO.insert(file);
        }
    }else if(!req.file && size.filename){
        await fileDAO.remove(size.filename);
    }

    const result = await sizeDAO.update(name, file, id);
    const message = "la taille a bien été modifié";
    res.status(200).send({"Message": message, "Size": result});
}

const getById = async (req, res) => {
     const {id} = req.params;
     const size = await sizeDAO.getById(id);
     res.status(200).send({"Size": size});
}

const remove = async (req, res) => {
    const {id} = req.params;
    const [size] = await sizeDAO.getById(id);
    await sizeDAO.remove(id);
    await fileDAO.remove(size.filename);
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
