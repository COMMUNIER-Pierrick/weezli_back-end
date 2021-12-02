const Opinion = require("../services/models/Opinion");
const opinionDAO = require("../services/database/dao/opinionDAO");
const userDAO = require("../services/database/dao/userDAO");
const log = require("../log/logger");
const User = require("../services/models/User");
const userController = require("./user");
const opinionController = require("./opinion");

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

const getOpinionUserByUser = async (req, res) => {
    try {
        const {idLivreur, idExpediteur} = req.params;
        console.log(idLivreur);
        console.log(idExpediteur);
        const opinions = await opinionDAO.getOpinionUserByUser(idLivreur, idExpediteur);
        if(opinions.length > 0){
            const listOpinions = await listOpinion(opinions);
            res.status(200).send({"opinion": listOpinions});
        }else{
            res.status(200).send( {"Message": "Aucune relation trouvé", "Opinion": []} );
        }

    }catch (error) {
        log.error("Error getOpinionUserByUser controller : " + error);
    }
}

const insert = async (req, res) => {
    try{
        const {idLivreur, idExpediteur} = req.body;
            const opinions = await insertOpinion(idLivreur, idExpediteur);
            res.status(200).send({"Opinions": opinions});
    }catch (error) {
        log.error("Error insertRealtion controller : " + error);
    }
}

const update = async (req, res) => {
    try{
        const {opinion} = req.body;
        const id = opinion.id
        const number = opinion.number;
        const comment = opinion.comment;
        const idUser = opinion.idUser;
        const opinionBDD = await opinionDAO.getByIdWithRelation(opinion.id, opinion.idUser);

        if(opinionBDD.length !== 0){
            const newOpinion = Opinion.OpinionUpdate(id, number, comment, 'Active');
            const opinion = await opinionDAO.update(newOpinion);
            const user = await userDAO.getById(idUser);
            await updateAverageOpinion(user, number);
            res.status(200).send({"Opinion": opinion, "User": user});
        }else{
            res.status(400).send({"Message": "une erreur c'est produite"});
        }
    }catch (error) {
        log.error("Error update controller : " + error);
    }
    /**JSON a envoyer du front
     * {
    "Opinion": {
        "number" : 3,
        "comment" : "Good job"
    },
    "idUser": 6,
    "idOrder" : 2
}
     *
     * */
}

const remove = async (req, res) => {
    try{
        const {id, idUser} = req.params;
        const opinionBDD = await opinionDAO.getByIdWithRelation(id, idUser);
        if(opinionBDD.length !== 0){
            await opinionDAO.remove(id);
            res.status(200).send({"Message": "Votre opinion à été enlevée"});
        }else{
            res.status(400).send({"Message": "une erreur c'est produite"});
        }
    }catch (error) {
        log.error("Error remove controller : " + error);
    }
}

/*pour afficher la liste des opinions poster par de l'utilisateur*/
const getAllOpinionByUser = async (req, res) => {
    try {
        const {idUser} = req.params;
        const opinions = await opinionDAO.getAllOpinionByUser(idUser);
        const listOpinion = await opinionController.listOpinion(opinions);
        res.status(200).send( {"Opinions": listOpinion} );
    }catch (error) {
        log.error("Error getAllOpinionByUser controller : " + error);
    }
};

/*pour afficher la liste des opinions poster par de l'utilisateur*/
const getAllOpinionReceivedByUser = async (req, res) => {
    try {
        const {idUser} = req.params;
        const opinions = await opinionDAO.getAllOpinionReceivedByUser(idUser);
        const listOpinions = await listOpinion(opinions);
        res.status(200).send( {"Opinions": listOpinions} );
    }catch (error) {
        log.error("Error getAllOpinionReceivedByUser controller : " + error);
    }
};

module.exports = {
    insert,
    remove,
    update,
    getById,
    getOpinionUserByUser,
    insertOpinion,
    getUserByUser,
    listOpinion,
    getAllOpinionByUser,
    getAllOpinionReceivedByUser
};

async function listOpinion(opinions){
    let listOpinion = [];
    for(let i = 0; i < opinions.length; i++){
        const newOpinion = new Opinion(opinions[i].id, opinions[i].number ,opinions[i].comment, opinions[i].id_user, opinions[i].status, opinions[i].idUserOpinion, opinions[i].id_types);
        listOpinion.push({"Opinion": newOpinion});
    }
    return listOpinion;
}

async function getUserByUser(idLivreur, idExpediteur){
    const opinions = await opinionDAO.getOpinionUserByUser(idLivreur, idExpediteur);
    const listOpinions = await listOpinion(opinions);
    return listOpinions;
}

async function insertOpinion(idLivreur, idExpediteur){
    const list = await getUserByUser(idLivreur, idExpediteur);
    console.log(list.length);
    if(list.length !== 0){
    console.log("coucou");
        const opinions = await listOpinion(list);
        return opinions;
    }else {
    console.log("hello");
        /*Opinion sur le livreur par l'expediteur*/
        const opinionLivreur = await opinionDAO.insert(idLivreur);
        /*Opinion expediteur par le livreur*/
        const opinionExpediteur = await opinionDAO.insert(idExpediteur);
        /*expediteur*/
        await opinionDAO.insertRealtion(opinionLivreur, idExpediteur, 1);
        /*livreur*/
        await opinionDAO.insertRealtion(opinionExpediteur, idLivreur, 2);

        const listOpinions = await getUserByUser(idLivreur, idExpediteur)
        const opinions = await listOpinion(listOpinions);
        return opinions;
    }
}

async function updateAverageOpinion(user, note) {

    const newNote = note;
    const listOpinions = await opinionDAO.getAllOpinionByUser(user.id);

    if(listOpinions.length == 1){
        user.average_opinion = newNote;
        const updateUser = await userDAO.updateAverageOpinion(user);
    }else{
    console.log("hellor");
        let moyenneOpinion;
        let totalOpinion = 0;
        for(let i = 0; i < listOpinions.length; i++){
            totalOpinion += listOpinions[i].number;
        }
        moyenneOpinion = (totalOpinion / listOpinions.length);
        user.average_opinion = moyenneOpinion;
        const updateUser = await userDAO.updateAverageOpinion(user);
    }
}
