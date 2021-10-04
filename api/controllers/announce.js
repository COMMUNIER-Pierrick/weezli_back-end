const announceDAO = require('../services/database/dao/announceDAO');
const log = require('../log/logger');
const Announce = require('../services/models/Announce');
const Search = require('../services/models/Search');
const fileDAO = require("../services/database/dao/fileDAO");

const insert = async (req, res) => {
    let fileOne = '';
    let fileTwo = '';
    let fileThree = '';
    let fileFour = '';
    let fileFive = '';
    let strFilesName = '';
    let urlImages = '';
    const announce = Announce.AnnounceInsert(req.body.Announce.packages, req.body.Announce.idType, req.body.Announce.price, req.body.Announce.transact, req.body.Announce.imgUrl, req.body.Announce.userAnnounce);
    req.files.forEach(el => el.fieldname === 'fileOne' ? fileOne = el : el.fieldname === 'fileTwo' ? fileTwo = el : el.fieldname === 'fileThree' ? fileThree = el : el.fieldname === 'fileFour' ? fileFour = el : fileFive = el);
    if(fileOne){await fileDAO.insert(fileOne.filename); strFilesName += fileOne.filename + ", ";}
    if(fileTwo){await fileDAO.insert(fileTwo.filename); strFilesName += fileTwo.filename + ", "; }
    if(fileThree){await fileDAO.insert(fileThree.filename); strFilesName += fileThree.filename + ", ";}
    if(fileFour){await fileDAO.insert(fileFour.filename); strFilesName += fileFour.filename + ", ";}
    if(fileFive){await fileDAO.insert(fileFive.filename); strFilesName += fileFive.filename + ", ";}

    const indexEnd = strFilesName.lastIndexOf(',');
    if(indexEnd !== -1){ urlImages = strFilesName.slice(0, indexEnd)}

    const result = await announceDAO.insert(announce, urlImages);
    const message = "L'annonce a bien été créé.";
    return res.status(200).send({"Message": message , "Announce": result});
};

const update = async (req, res) => {
    const {id} = req.params;
    let fileOne = '';
    let fileTwo = '';
    let fileThree = '';
    let fileFour = '';
    let fileFive = '';
    let strFilesName = '';
    let urlImages = '';
    const announce = Announce.AnnounceUpdate(id, req.body.Announce.packages, req.body.Announce.idType, req.body.Announce.price, req.body.Announce.transact, req.body.Announce.imgUrl, req.body.Announce.userAnnounce);
    req.files.forEach(el => el.fieldname === 'fileOne' ? fileOne = el : el.fieldname === 'fileTwo' ? fileTwo = el : el.fieldname === 'fileThree' ? fileThree = el : el.fieldname === 'fileFour' ? fileFour = el : fileFive = el);

    const announceBack = await announceDAO.getById(id);
    const imgAnnounceBack = announceBack.imgUrl.split(',');
    const fieldname = [fileOne, fileTwo, fileThree, fileFour, fileFive];

    fieldname.forEach(el => imgAnnounceBack.forEach(fi => imageControl(el, fi)));

    strFilesName += fileOne.filename + ", ";
    strFilesName += fileTwo.filename + ", ";
    strFilesName += fileThree.filename + ", ";
    strFilesName += fileFour.filename + ", ";
    strFilesName += fileFive.filename + ", ";

    const indexEnd = strFilesName.lastIndexOf(',');
    if(indexEnd !== -1){ urlImages = strFilesName.slice(0, indexEnd)}

    const result = await announceDAO.update(announce, urlImages);
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
        sizes.forEach(el => nbSize += (el.size.id + elem));
        /*for(let i = 0; i < sizes.length; i++){
            nbSize += sizes[i].size.id + elem;
        }*/
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

async function imageControl(fieldname, imgBack){
        if(imgBack !== fieldname.filename){
            if(imgBack !== ''){
                await fileDAO.remove(imgBack)
            }
            await fileDAO.insert(fieldname.filename);
        } else if(!fieldname.filename && imgBack){
            await fileDAO.remove(imgBack);
        }
}
