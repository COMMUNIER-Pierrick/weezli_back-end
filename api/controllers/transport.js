const transportDAO = require('../services/database/dao/transportDAO');
const log = require('../log/logger');
let Transport = require('../services/models/Transport');
const fileDAO = require("../services/database/dao/fileDAO");

const getAll = async (req, res) => {
    const transport = await transportDAO.getAll();
    res.status(200).send({"Transports": transport});
}

const insert = async (req, res) => {
    const name = req.body.name;
    let file = '';
    if(req.file){
        file = req.file.filename;
        await fileDAO.insert(file);
    }
    const result = await transportDAO.insert(name, file);
    const message = "le moyen de transport a bien été créé.";
    return res.status(200).send({"Message": message, "Transport": result});
}

const update = async (req, res) => {
    const {id} = req.params;
    const name = req.body.name;
    let file = '';
    const [transport] = await transportDAO.getById(id);
    if(req.file){
        file = req.file.filename
        if(transport.filename !== file){
            if(transport.filename !== ''){
                await fileDAO.remove(transport.filename);
            }
            await fileDAO.insert(file);
        }
    }else if(!req.file && transport.filename){
        await fileDAO.remove(transport.filename);
    }

    const result = await transportDAO.update(name, file, id);
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
    const [transport] = await transportDAO.getById(id);
    await transportDAO.remove(id);
    await fileDAO.remove(transport.filename);
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
