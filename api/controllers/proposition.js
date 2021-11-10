const log = require('../log/logger');
const PropositionModel = require('../services/models/Proposition');
const propositionDAO = require("../services/database/dao/propositionDAO");
const orderDAO = require("../services/database/dao/orderDAO");
const Order = require("../services/models/Order");
const orderController = require("./order");
const announceDAO = require("../services/database/dao/announceDAO");
const statusPropositionDAO = require("../services/database/dao/status_propositionDAO");

const insert = async (req, res) => {

    const {Proposition} = req.body;
    const newProposition = new PropositionModel(Proposition.id_announce, Proposition.id_user, Proposition.proposition, Proposition.status_proposition);
    await propositionDAO.insert(newProposition);
    const result = await getByIdProposition(newProposition.id_announce, newProposition.id_user);
    let message = "";
    let codeValidated = orderController.codeValidatedRandom();
    const dateOrder = new Date();
    const newOrder = Order.OrderInsert(codeValidated, 1, result.id_announce, dateOrder);

    /*si proposition validé */
    if(result.status_proposition.id === 3) {
       const order = await orderDAO.insert(newOrder);
       message = "Votre commande a été créée.";
       return res.status(200).send({"Order": order});

    }else{
         message = "La proposition a bien été créée.";
         return res.status(200).send({"Message": message, "Proposition": result});
    }
   }

const update = async (req, res) => {
	const { Proposition } = req.body;
	const result = await propositionDAO.update(Proposition);
    let message = "";
    let codeValidated = orderController.codeValidatedRandom();
    const dateOrder = new Date();
    const newOrder = Order.OrderInsert(codeValidated,1, result.id_announce, dateOrder);
    console.log(newOrder);
    let order = "";

    /*si proposition validé */
    if(result.status_proposition === 3) {
       order = await orderDAO.insert(newOrder)
        if(order.length > 0){
            message = "Votre commande a été créée.";
            res.status(200).send( {"Message": message , "Order" : order});
        }
    }else{
         message = "La proposition a bien été modifiée ";
         res.status(200).send( {"Message": message , "Proposition": result});
    }
};

const remove = async (req, res) => {

	const { id_announce } = req.params;
	await propositionDAO.remove(id_announce);
	const message = "La proposition a bien été supprimée";
	res.status(200).send({"Message": message});
};

const getAll = async (req, res) => {

    const proposition = await propositionDAO.getAll();
    res.status(200).send( {"Propositions": proposition} );
};

const getByIdAnnouce = async (req, res) => {

    const {id_announce} = req.params;
    const proposition = await propositionDAO.getByIdAnnouce(id_announce);
    res.status(200).send( {"Propositions": proposition} );
};

const getByIdAnnouceAndUser = async (req, res) => {

    const {id_announce} = req.params;
    const {id_user} = req.params;
    const proposition = await propositionDAO.getByIdAnnouceAndUser(id_announce, id_user);
    let announce = await announceDAO.getById(proposition[0].id_announce);
    let statusProposition = await statusPropositionDAO.getById(proposition[0].id_status_proposition);
    const newProposition = new Proposition(announce, proposition[0].id_user, proposition[0].proposition, statusProposition);
    res.status(200).send({"proposition": newProposition});
};

module.exports = {
    insert,
    update,
    remove,
    getAll,
    getByIdAnnouce,
    getByIdAnnouceAndUser
};

async function getByIdProposition(id_announce,id_user){
    const proposition = await propositionDAO.getByIdAnnouceAndUser(id_announce, id_user);
    let announce = await announceDAO.getById(proposition[0].id_announce);
    let statusProposition = await statusPropositionDAO.getById(proposition[0].id_status_proposition);
    const newProposition = new PropositionModel(announce, proposition[0].id_user, proposition[0].proposition, statusProposition);
    return newProposition;
}

/*async function getByIdOrder(id){

    const announce = await announceDAO.getById(order[0].id_announce);
    const status = await statusDAO.getById(order[0].id_status);
    const newOrder = new Order(id, order[0].code_validated, status, announce, order[0].date_order, order[0].qr_code);
    return newOrder;
}*/
