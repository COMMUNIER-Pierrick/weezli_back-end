const announceDAO = require('../services/database/dao/announceDAO');
const log = require('../log/logger');
const Announce = require('../services/models/Announce');

const insert = async (req, res) => {
    const announce = Announce.AnnounceInsert(req.body.Announce.packages, req.body.Announce.idType, req.body.Announce.price, req.body.Announce.transact, req.body.Announce.imgUrl, req.body.Announce.userAnnounce);
    const result = await announceDAO.insert(announce);
    const message = "L'annonce a bien été créé.";
    return res.status(200).send({"Message": message , "Announce": result});
};

const update = async (req, res) => {
    const {id} = req.params;
    const announce = Announce.AnnounceUpdate(id, req.body.Announce.packages, req.body.Announce.idType, req.body.Announce.price, req.body.Announce.transact, req.body.Announce.imgUrl, req.body.Announce.userAnnounce);
    const result = await announceDAO.update(announce);
    const message = "L'annonce a bien été mis à jour.";
    return res.status(200).send({"Message": message , "Announce": result});
};

const remove = async (req, res) => {
    const { id } = req.params;
    await announceDAO.remove(id);
    const message = "Suppression réussie.";
    res.status(200).send({ "Message": message });
};

const getByType = async (req, res) => {
    const { id_type } = req.params;
    const announces = await announceDAO.getByType(id_type);
    res.status(200).send( {"Announces": announces} );
};

const getById = async (req, res) => {
    const {id} = req.params;
    const announce = await announceDAO.getById(id);
    res.status(200).send( {"Announce": announce} );
};

const getByUserType = async (req, res) => {

};

module.exports = {
    insert,
    remove,
    update,
    getByType,
    getById,
    getByUserType
};
