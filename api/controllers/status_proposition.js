const status_propositionDAO = require('../services/database/dao/status_propositionDAO');
const log = require('../log/logger');
let Status_proposition = require('../services/models/Status_proposition');

const getAll = async (req, res) => {
    const status_proposition = await status_propositionDAO.getAll();
    res.status(200).send({"Status_proposition": status_proposition});
}

const insert = async (req, res) => {
    const name = new Status_proposition(req.body.name);
    const status_proposition = await status_propositionDAO.insert(name);
    const message = "Le status proposition a bien été créé.";
    return res.status(200).send({"Message": message , "Status_proposition": status_proposition});
}

const update = async (req, res) => {
    const {id} = req.params;
    const statusPropositionName = new Status_proposition(id, req.body.name);
    const status_proposition = await status_propositionDAO.update(statusPropositionName);
    const message = "Le status proposition a bien été modifié.";
    res.status(200).send({"Message": message , "Status_proposition": status_proposition});
}

const getById = async (req, res) => {
    const {id} = req.params;
    const status_proposition = await status_propositionDAO.getById(id);
    res.status(200).send({"Status_proposition": status_proposition});
}

const remove = async (req, res) => {
    const {id} = req.params;
    await status_propositionDAO.remove(id);
    const message = "Le status proposition a bien été supprimée";
    res.status(200).send({"Message": message});
}

module.exports = {
    insert,
    remove,
    update,
    getAll,
    getById
};
