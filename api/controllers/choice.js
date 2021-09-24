const choiceDAO = require('../services/database/dao/choiceDAO');
const log = require('../log/logger');
let Choice = require('../services/models/Choice');

const getAll = async (req, res) => {
	const results = await choiceDAO.getAll();
	res.status(200).send( {"Choices": results} );
};

const insert = async (req, res) => {
	const choice = Choice.ChoiceInsert(req.body.name, req.body.description, req.body.price);
	const result = await choiceDAO.insert(choice);
	const message = "La formule a bien été créée";
	return res.status(200).send( {"Message": message , "Choice": result});
};

const update = async (req, res) => {
	const { id } = req.params;
	const choice = Choice.ChoiceInsert(req.body.name, req.body.description, req.body.price);
	const result = await choiceDAO.update(choice, id);
	const message = "La formule a bien été modifiée ";
	res.status(200).send( {"Message": message , "Choice": result});
};

const getById = async (req, res) => {
	const { id } = req.params;
	const choice = await choiceDAO.getById(id);
	res.status(200).send( {"Choice": choice} );
};

const remove = async (req, res) => {
	const { id } = req.params;
	await choiceDAO.remove({id});
	const message = "La formule a bien été supprimée";
	res.status(200).send({"Message": message});
};

module.exports = {
	insert,
	remove,
	update,
	getAll,
	getById
};
