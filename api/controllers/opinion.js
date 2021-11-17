const Opinion = require("../services/models/Opinion");
const opinionDAO = require("../services/database/dao/opinionDAO");
const log = require("../log/logger");

/**
 *
 * ajouter la creation d'opinion dans la creation de l'order qui se trouve dans proposition
 *
 * */

const getById = async (req, res) => {
    try{
        const {id} = req.params;
        const opinion = await opinionDAO.getById(id);
        res.status(200).send({"Opinion": opinion})
    }catch (error) {
        log.error("Error getById controller : " + error);
    }
}

const getAllOpinionByUser = async (req, res) => {
    try {
        const {idUser} = req.params;
        const opinions = await opinionDAO.getAllOpinionByUser(idUser);
        const listOpinions = await listOpinion(opinions);
        res.status(200).send( {"Opinions": listOpinions} );
    }catch (error) {
            log.error("Error getAllOpinionByUser controller : " + error);
    }
};

const getOpinionByOrder = async (req, res) => {
    try {
        const {idOrder} = req.params;
        const opinions = await opinionDAO.getOpinionByOrder(idOrder);
        const listOpinions = await listOpinion(opinions);
        res.status(200).send( {"Opinions": listOpinions} );
    }catch (error) {
        log.error("Error getOpinionByOrder controller : " + error);
    }
}

const getOpinionUserByUser = async (req, res) => {
    try {
        const {idLivreur, idExpediteur} = req.params;
        const opinions = await opinionDAO.getOpinionUserByUser(idLivreur, idExpediteur);
        if(opinions.length > 0){
            const listOpinions = await listOpinion(opinions);
            res.status(200).send( {"Opinions": listOpinions} );
        }else{
            res.status(200).send( {"Message": "Aucune relation trouvé", "Opinion": []} );
        }

    }catch (error) {
        log.error("Error getOpinionByOrder controller : " + error);
    }
}

const insert = async (req, res) => {
    try{
        const {idLivreur, idExpediteur, idOrder} = req.body;
        const list = await getUserByUser(idLivreur, idExpediteur)

        if(list.length !== 0){
            const opinions = await listOpinion(list);
            res.status(200).send({"Message": "Cette relation existe deja" ,"Opinions": opinions});
        }else{
            /*Opinion sur le livreur par l'expediteur*/
            const opinionLivreur = await opinionDAO.insert(idLivreur);
            /*Opinion expediteur par le livreur*/
            const opinionExpediteur = await opinionDAO.insert(idExpediteur);
            /*expediteur*/
            await opinionDAO.insertRealtion(opinionLivreur, idExpediteur, idOrder, 1);
            /*livreur*/
            await opinionDAO.insertRealtion(opinionExpediteur, idLivreur, idOrder, 2);

            const listOpinions = await getUserByUser(idLivreur, idExpediteur)
            const opinions = await listOpinion(listOpinions);
            res.status(200).send({"Opinions": opinions});
        }


    }catch (error) {
        log.error("Error insertRealtion controller : " + error);
    }
}

const update = async (req, res) => {
    try{
        const {id} = req.params;
        const {number, comment} = req.body.Opinion;
        const newOpinion = Opinion.OpinionUpdate(id, number, comment);
        const opinion = await opinionDAO.update(newOpinion);
        res.status(200).send({"Opinion": opinion});
    }catch (error) {
        log.error("Error update controller : " + error);
    }
}

const remove = async (req, res) => {
    try{
        const {id} = req.params;
        await opinionDAO.remove(id);
        res.status(200).send( {"Message": "Suppression réussie"});
    }catch (error) {
        log.error("Error remove controller : " + error);
    }
}

module.exports = {
    insert,
    remove,
    update,
    getAllOpinionByUser,
    getOpinionByOrder,
    getById,
    getOpinionUserByUser
};

async function listOpinion(opinions){
    let listOpinion = [];
    for(let i = 0; i < opinions.length; i++){
        const newOpinion = new Opinion(opinions[i].id,opinions[i].number ,opinions[i].comment, opinions[i].id_user, opinions[i].status);
        listOpinion.push({"opinion": newOpinion});
    }
    return listOpinion;
}

async function getUserByUser(idLivreur, idExpediteur){
    const opinions = await opinionDAO.getOpinionUserByUser(idLivreur, idExpediteur);
    if(opinions.length > 0){
        return opinions;
    }else{
        return [];
    }
}
