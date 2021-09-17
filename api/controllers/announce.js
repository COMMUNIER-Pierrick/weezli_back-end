const announceDAO = require('../services/database/dao/announceDAO');
const log = require('../log/logger');
const Announce = require('../services/models/Announce');

const insert = async (req, res) => {
    let announce = new Announce(req.body.announce.packages, req.body.announce.idType, req.body.announce.price, req.body.announce.transact, req.body.announce.imgUrl, req.body.announce.dateCreated, req.body.announce.userAnnounce);
    const result = await announceDAO.insert(announce);
    const message = "L'annonce a bien été créé.";
    return res.status(200).send({"message": message , "announce": result});
};

const update = async (req, res) => {
    const {id} = req.params;
    let announce = new Announce(id, req.body.announce.packages, req.body.announce.idType, req.body.announce.price, req.body.announce.transact, req.body.announce.imgUrl, req.body.announce.dateCreated, req.body.announce.userAnnounce);
    const result = await announceDAO.update(announce);
    const message = "L'annonce a bien été mis à jour.";
    return res.status(200).send({"message": message , "announce": result});
};

const remove = async (req, res) => {
    const { id } = req.params;
    await announceDAO.remove(id);
    const message = "Suppression réussie.";
    res.status(200).send({ "message": message });
};

const getByType = async (req, res) => {
    const { id_type } = req.params;
    let announces = null;
    announces = await announceDAO.getByType(id_type);
    res.status(200).send( {"announces": announces} );
};

const getById = async (req, res) => {
    const {id} = req.params;
    let announce = null;
    announce = await announceDAO.getById(id);
    res.status(200).send( {"announce": announce} );
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
