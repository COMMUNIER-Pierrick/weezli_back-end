const announceDAO = require('../services/database/dao/announceDAO');
const log = require('../log/logger');
const Announce = require('../services/models/Announce');
const Search = require('../services/models/Search');

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

const getSearch = async (req, res) => {
    const {departure, arrival, date, sizes, kgAvailable, transport, type} = req.body.Search;
    const newSearch = new Search(departure, arrival, date, sizes, kgAvailable, transport, type);
    let condition = "WHERE ";
    if(type){
        condition += "a.id_type = ? ";
    }else{
        condition += ""
    }

    if(transport){
        condition += "AND p.id_transport = ? ";
    }else{
        condition += ""
    }

    if(departure){
        condition += "AND ad_depart.city = ? "
    }else{
        condition += ""
    }

    if(arrival){
        condition += "AND ad_destination.city = ? ";
    }else{
        condition += ""
    }

    if(date){
        condition += "AND p.datetime_departure <  ? ";
    }else{
        condition += ""
    }

    if(kgAvailable){
        condition += "AND p.kg_available <= ? ";
    }else{
        condition += ""
    }

    if(sizes){
        condition += "AND s.id in (1, 2, 3, 4) ";
    }else{
        condition += ""
    }

    const search = await announceDAO.getSearch(condition, newSearch)
    res.status(200).send({"Announces": search});
}

module.exports = {
    insert,
    remove,
    update,
    getByType,
    getById,
    getByUserType,
    getSearch
};
