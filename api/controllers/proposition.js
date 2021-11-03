const log = require('../log/logger');
let Proposition = require('../services/models/Proposition');
const propositionDAO = require("../services/database/dao/propositionDAO");

const insert = async (req, res) => {

    const { id_announce, id_user, proposition, status_proposition } = req.body.Proposition;

    const newProposition = Proposition(id_announce, id_user, proposition, status_proposition);
    const result = await propositionDAO.insert(newProposition);
    const message = "La proposition a bien été créée";
    return res.status(200).send({"Message": message, "Proposition": result});
};

const update = async (req, res) => {

	const { Proposition } = req.body;
	const result = await propositionDAO.update(Proposition);
	const message = "La proposition a bien été modifiée ";
	res.status(200).send( {"Message": message , "Proposition": result});
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
    res.status(200).send( {"proposition": proposition} );
};

module.exports = {
    insert,
    update,
    remove,
    getAll,
    getByIdAnnouce,
    getByIdAnnouceAndUser
};


