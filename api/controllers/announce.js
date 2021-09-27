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

    if(type && verifNumber(type)){
        condition += "a.id_type = " + type + " ";
    }else{
        res.status(400).send({"Error": "Les caractères spéciaux ne sont pas admis: type"});
        throw new Error("Erreur caractère special");
    }

    if(transport && verifNumber(transport)){
        condition += "AND p.id_transport = " + transport + " ";
    }else{
        res.status(400).send({"Error": "Les caractères spéciaux ne sont pas admis : transport"});
        throw new Error("Erreur caractère special");
    }

    if(departure && verifString(departure)){
        condition += "AND ad_depart.city = '"+ departure +"' ";
    }else{
        res.status(400).send({"Error": "Les caractères spéciaux ne sont pas admis : departure"});
        throw new Error("Erreur caractère special");
    }

    if(arrival && verifString(arrival)){
        condition += "AND ad_destination.city = '" + arrival + "' ";
    }else{
        res.status(400).send({"Error": "Les caractères spéciaux ne sont pas admis : arrival"});
        throw new Error("Erreur caractère special");
    }

    if(date && verifDate(date)){
        condition += "AND p.datetime_departure < '" + date + "' ";
    }else{
        res.status(400).send({"Error": "Les caractères spéciaux ne sont pas admis : date"});
        throw new Error("Erreur caractère special");
    }

    if(kgAvailable && verifNumber(kgAvailable)){
        condition += "AND p.kg_available <= " + kgAvailable + " ";
    }else{
        res.status(400).send({"Error": "Les caractères spéciaux ne sont pas admis : kgAvailable"});
        throw new Error("Erreur caractère special");
    }

    if(sizes){
        let nbSize = "";
        const elem = ", ";
        for(let i = 0; i < sizes.length; i++){
            nbSize += sizes[i].size.id + elem;
        }
        let index = nbSize.lastIndexOf(elem);
        let ids = nbSize.slice(0, index);
        condition += `AND s.id in ( ${ids} ); `;
    }else{
        res.status(400).send({"Error": "Les caractère spéciaux ne sont pas admis"})
    }
    const search = await announceDAO.getSearch(condition)
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

function verifString(str){
    const pattern = new RegExp(/[`~!@#$%^&*()_|+=?;:'",.<>{}\[\]\\\/\d]/);
    return !pattern.test(str);
}

function verifNumber(str){
    const patLetter = /[a-zA-Z]/;
    const patSpace = /\s/g;
    const pattern = new RegExp(/[`~!@#$%^&*()_|+\-=?;:'",<>{}\[\]\\\/]/);
    return (!pattern.test(str) && !patSpace.test(str) && !patLetter.test(str));
}

function verifDate(str){
    const patDate = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/;
    const patSpace = /\s/g;
    const pattern = new RegExp(/[`~!@#$%^&*()_|+=?;'",.<>{}\[\]\\\/]/);
    return !pattern.test(str) && patDate.test(str) && !patSpace.test(str);
}
