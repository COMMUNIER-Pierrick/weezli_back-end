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
    let announceParse = JSON.parse(req.body.Announce);
    const announce = Announce.AnnounceInsert(announceParse.packages, announceParse.idType, announceParse.price, announceParse.imgUrl, announceParse.userAnnounce);

    //const announce = Announce.AnnounceInsert(req.body.Announce.packages, req.body.Announce.idType, req.body.Announce.price, req.body.Announce.transact, req.body.Announce.imgUrl, req.body.Announce.userAnnounce);
    req.files.forEach(el => el.fieldname === 'fileOne' ? fileOne = el : el.fieldname === 'fileTwo' ? fileTwo = el : el.fieldname === 'fileThree' ? fileThree = el : el.fieldname === 'fileFour' ? fileFour = el : fileFive = el);

    const files = [fileOne, fileTwo, fileThree, fileFour, fileFive];
    files.forEach(el => {if(el){fileDAO.insert(fileOne.filename); strFilesName += el.filename + ","}} );
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
    let announceParse = JSON.parse(req.body.Announce);
    const announce = Announce.AnnounceUpdate(id,announceParse.packages, announceParse.idType, announceParse.price, announceParse.imgUrl, announceParse.userAnnounce);
    //const announce = Announce.AnnounceInsert(id, req.body.Announce.packages, req.body.Announce.idType, req.body.Announce.price, req.body.Announce.transact, req.body.Announce.imgUrl, req.body.Announce.userAnnounce);

    //insertion de l'image dans sa variable si il y en a un
    req.files.forEach(el => el.fieldname === 'fileOne' ? fileOne = el : el.fieldname === 'fileTwo' ? fileTwo = el : el.fieldname === 'fileThree' ? fileThree = el : el.fieldname === 'fileFour' ? fileFour = el : fileFive = el);

    //récupération des nom des fichier enregistré en back avec création d'un tableau des images et création d'un tableau des fichier recu
    const announceBack = await announceDAO.getById(id);
    let imgAnnounceBack = announceBack.imgUrl.split(',');
    const files = [fileOne, fileTwo, fileThree, fileFour, fileFive];

    // je controle les index des 2 fichier et je fais le traitement nécéssaire
   for(let e = 0; e < files.length; e++){
        for(let i = 0; i < imgAnnounceBack.length; i++){
            if(i === e) { // le traitement se fait uniquement sur le meme index
                if (files[e] && imgAnnounceBack[i]) { // si j'ai un fichier envoyer et une variable an back
                    if (files[e].filename !== imgAnnounceBack[i]) { // si mon fichier est different de ma variable
                        if (imgAnnounceBack[i] !== '') { // si ma variable est different de rien
                            await fileDAO.remove(imgAnnounceBack[i]); // alors je supprime mon fichier
                            imgAnnounceBack.splice(i, 1, files[e].filename); // remplace le fichier supprimé
                        }
                        await fileDAO.insert(files[e].filename);
                    }
                } else if (files[e] === '' && imgAnnounceBack[i]) { // si je n'ai pas de fichier et j'ai une varibale
                    await fileDAO.remove(imgAnnounceBack[i]); // je supprime mon fichier
                    imgAnnounceBack.splice(i, 1, ''); // remplace le fichier supprimé
                } else if (files[e] && imgAnnounceBack[i] === '') { // si j'ai un fichier et pas de variable
                    await fileDAO.insert(files[e].filename); // j'ajoute mon fichier
                }
            }
        }
    }
    // reconstruction de la string de fichier pour le back et supprime la dernière virgule
    files.forEach(el => {if(el){ strFilesName += el.filename + ","}} );
    const indexEnd = strFilesName.lastIndexOf(',');
    if(indexEnd !== -1){ urlImages = strFilesName.slice(0, indexEnd)}

    const result = await announceDAO.update(announce, urlImages);
    const message = "L'annonce à bien été mis à jour.";
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

const getTypeByUser = async (req, res) => {
    const {id} = req.params;
    const{idType} = req.params;
    const announce = await announceDAO.getByTypeUser(idType,id);
    res.status(200).send( {"Announces": announce} );
};

const getALLUser = async (req, res) => {
    const {id} = req.params;
    const announce = await announceDAO.getAllUser(id);
    res.status(200).send( {"Announces": announce} );
}

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
    getTypeByUser,
    getSearch,
    getALLUser,
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

