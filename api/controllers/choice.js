const choiceDAO = require('../services/database/dao/choiceDAO');
const log = require('../log/logger');
let Choice = require('../services/models/Choice');

const getAll = async (req, res) => {
	let results = null;
	results = await choiceDAO.getAll();
	res.status(200).send( {"choices": results} );
};

const insert = async (req, res) => {
	let choice = new Choice(req.body.name, req.body.description, req.body.price);
	const result = await choiceDAO.insert(choice);
	let message = "La formule a bien été créée";
	return res.status(200).send( {"message": message , "choice": result});
};

const update = async (req, res) => {
	const { id } = req.params;
	let choice = new Choice(req.body.name, req.body.description, req.body.price);
	let result = null;
	result = await choiceDAO.update(choice, id);
	let message = "La formule a bien été modifiée ";
	res.status(200).send( {"message": message , "choice": result});
};

const getById = async (req, res) => {
	const { id } = req.params;
	let result = null;
	formule = await choiceDAO.getById({id});
	res.status(200).send( {"choice": result} );
};

const remove = async (req, res) => {
	const { id } = req.params;
	await choiceDAO.remove({id});
	let message = "La formule a bien été supprimée";
	res.status(200).send({"message": message});
};

module.exports = {
	insert,
	remove,
	update,
	getAll,
	getById
};
