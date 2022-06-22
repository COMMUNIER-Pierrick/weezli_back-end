const log = require('../log/logger');
const PropositionModel = require('../services/models/Proposition');
const propositionDAO = require("../services/database/dao/propositionDAO");
const orderDAO = require("../services/database/dao/orderDAO");
const Order = require("../services/models/Order");
const orderController = require("./order");
const announceDAO = require("../services/database/dao/announceDAO");
const Announce = require("../services/models/Announce");
const statusPropositionDAO = require("../services/database/dao/status_propositionDAO");
const userDAO = require("../services/database/dao/userDAO");
const opinionController = require("./opinion");

const insert = async (req, res) => {
    // Récupération des données dans la requête.
    const {Proposition} = req.body;
    // Création, insertion et récupération de notre proposition.
    const newProposition = new PropositionModel(Proposition.id_announce, Proposition.id_user, Proposition.proposition, Proposition.status_proposition.id);
    await propositionDAO.insert(newProposition);
    const result = await getByIdProposition(newProposition.announce, newProposition.user);

    // Configuration des différentes données pour la création d'une commande.
    let message = "";
    let codeValidated = orderController.codeValidatedRandom();
    const dateOrder = new Date();
    // Création de l'objet order.
    const newOrder = Order.OrderInsert(codeValidated, 1, result.announce.id, dateOrder);
    let order = "";
    let opinion = "";

    // Si la proposition est validé (accord trouver sur le prix de la commission).
    if(result.status_proposition.id == 3) {
        /* Insertion de la commande */
        order = await orderDAO.insert(newOrder);
        /* Une fois la commande créer, nous inserons les avis qui lie les deux utilisateur qui seront à completer si
        c'est la premières fois qui sont tous les deux en relation ou on récupèrera leur dernier avis émis entre eux
        qu'ils pourront modifier. Selon le type d'annonce, nous modifions l'ordre des données dans l'opinionController. */
        if(result.announce.idTypes == 1){
            opinion = await opinionController.insertOpinion(Proposition.id_user, result.announce.userAnnounce.id);
            order = await orderDAO.getById(order.id);
            // Nous renvoyons les différents élément nécéssaire au front si tous c'est bien dérouler.
            message = "Votre commande a été créée.";
            res.status(200).send({"Message": message , "Proposition": result, "Order" : order, "Opinion": opinion});
        }else{
            opinion = await opinionController.insertOpinion(result.announce.userAnnounce.id, Proposition.id_user);
            order = await orderDAO.getById(order.id);
             // Nous renvoyons les différents élément nécéssaire au front si tous c'est bien dérouler.
            message = "Votre commande a été créée.";
            res.status(200).send({"Message": message , "Proposition": result, "Order" : order, "Opinion": opinion});
        }
    // Sinon si la proposition n'est pas validé (pas d'accord sur le prix de départ de la commission).
    }else{
        // Nous renvoyons la proposition et le message si l'insertion a fonctionné.
        message = "La proposition a bien été créée.";
        res.status(200).send({"Message": message, "Proposition": result});
    }
}

const update = async (req, res) => {
	const { Proposition } = req.body;
	const update = await propositionDAO.update(Proposition);
    const result = await getByIdProposition(Proposition.id_announce, Proposition.id_user);
    let message = "";
    let codeValidated = orderController.codeValidatedRandom();
    const dateOrder = new Date();
    const newOrder = Order.OrderInsert(codeValidated, 1, result.announce.id, dateOrder);
    let order = "";
    let opinion = "";

    /*si proposition validé */
        if(result.status_proposition.id == 3) {
            /*création de la commande*/
            order = await orderDAO.insert(newOrder);
            /*si commande création des avis*/
            if(result.announce.idTypes == 1){
                opinion = await opinionController.insertOpinion(Proposition.id_user, result.announce.userAnnounce.id);
                order = await orderDAO.getById(order.id);
                message = "Votre commande a été créée.";
                res.status(200).send({"Message": message , "Proposition": result, "Order" : order, "Opinion": opinion});
            }else{
                opinion = await opinionController.insertOpinion(result.announce.userAnnounce.id, Proposition.id_user);
                order = await orderDAO.getById(order.id);
                message = "Votre commande a été créée.";
                res.status(200).send({"Message": message , "Proposition": result, "Order" : order, "Opinion": opinion});
            }
        }else{
            message = "La proposition a bien été créée.";
            res.status(200).send({"Message": message, "Proposition": result});
        }
};

const remove = async (req, res) => {

	const { id_announce } = req.params;
	await propositionDAO.remove(id_announce);
	const message = "La proposition a bien été supprimée";
	res.status(200).send({"Message": message});
};

const getAllByUser = async (req, res) => {

    const { id_user } = req.params;
    const allProposition = await propositionDAO.getAllByUser(id_user);
    let newListProposition = [];
        for(let i = 0; i < allProposition.length; i++){
            const proposition = allProposition[i];
            const announce = await announceDAO.getById(proposition[0].id_announce);
            const user = await userDAO.getById(proposition[0].id_user);
            const status = await statusPropositionDAO.getById(proposition[0].id_status_proposition)
            const newProposition = new PropositionModel(announce, user, proposition[0].proposition, status);
            newListProposition.push({"Proposition" : newProposition});
        }
    res.status(200).send( {"Propositions": newListProposition} );
};

const getAll = async (req, res) => {

    const allProposition = await propositionDAO.getAll();
    let newListProposition = [];
        for(let i = 0; i < allProposition.length; i++){
            const proposition = allProposition[i];
            const announce = await announceDAO.getById(proposition.id_announce);
            const user = await userDAO.getById(proposition.id_user);
            const status = await statusPropositionDAO.getById(proposition.id_status_proposition)
            const newProposition = new PropositionModel(announce, user, proposition.proposition, status);
            newListProposition.push({"Proposition" : newProposition});
        }
    res.status(200).send( {"Propositions": newListProposition} );
};

const getByIdAnnounce = async (req, res) => {

    const {id_announce} = req.params;
    const proposition = await propositionDAO.getByIdAnnounce(id_announce);
    res.status(200).send( {"Propositions": proposition} );
};

const getByIdAnnounceAndUser = async (req, res) => {

    const {id_announce} = req.params;
    const {id_user} = req.params;
    const proposition = await propositionDAO.getByIdAnnounceAndUser(id_announce, id_user);
    let announce = await announceDAO.getById(proposition[0].id_announce);
    let statusProposition = await statusPropositionDAO.getById(proposition[0].id_status_proposition);
    const newProposition = new PropositionModel(announce, proposition[0].id_user, proposition[0].proposition, statusProposition);
    res.status(200).send({"proposition": newProposition});
};

const getByIdAnnounceAndStatus = async (req, res) => {

    const {id_announce} = req.params;
    const {id_status_proposition} = req.params;
    const proposition = await propositionDAO.getByIdAnnounceAndStatus(id_announce, id_status_proposition);
    let announce = await announceDAO.getById(proposition[0].id_announce);
    let statusProposition = await statusPropositionDAO.getById(proposition[0].id_status_proposition);
    const newProposition = new PropositionModel(announce, proposition[0].id_user, proposition[0].proposition, statusProposition);
    res.status(200).send({"proposition": newProposition});
};

module.exports = {
    insert,
    update,
    remove,
    getAll,
    getAllByUser,
    getByIdAnnounce,
    getByIdAnnounceAndUser,
    getByIdAnnounceAndStatus
};

async function getByIdProposition(id_announce,id_user){
    const proposition = await propositionDAO.getByIdAnnounceAndUser(id_announce, id_user);
    let announce = await announceDAO.getById(proposition[0].id_announce);
    let user = await userDAO.getById(proposition[0].id_user)
    let statusProposition = await statusPropositionDAO.getById(proposition[0].id_status_proposition);
    const newProposition = new PropositionModel(announce, user, proposition[0].proposition, statusProposition);
    return newProposition;
}
