const db = require("../models");

const add_colis = async (req, res) => {
	const {
        adress_departure,
        adress_arrival,
        datetime_departure,
        dimensions,
        kg_weight,
        price,
        validation_code,
        description,
        status,
        userId
    } = req.body;

	await db.colis.create({
        adress_departure,
        adress_arrival,
        datetime_departure,
        dimensions,
        kg_weight,
        price,
        validation_code,
        description,
        status,
        userId
    });
	
	return res.status(200).send("Le colis a bien été créé");
};

const get_all_colis = async (req, res) => {
	let results = null;
	results = await db.colis.findAll();
	res.status(200).send(results);
};

const get_one_colis = async (req, res) => {
	const { id } = req.params;
	let colis = null;
	colis = await db.colis.findAll({ where: { id: id } });
	res.status(200).send({ colis });
};

const update_colis = async (req, res) => {
	const { id } = req.params;
	await db.colis.update(req.body, { where: { id: id } });
	res.status(200).send("Le colis a bien été modifié");
};

const delete_colis = async (req, res) => {
	const { id } = req.params;
	await db.colis.destroy({ where: {id: id } });
	res.status(200).send("Le colis a bien été supprimé");
};


module.exports = {
	add_colis,
	get_one_colis,
	delete_colis,
	update_colis,
	get_all_colis,
};
