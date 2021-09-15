const db = require("../models");
const log = require("../../log/logger")

const add_formule = async (req, res) => {
	const {name, description, price, } = req.body;

	await db.formule.create({
        name,
		description,
		price,
    });
	
	return res.status(200).send("La formule a bien été créée");
};

/* Exemple de mise en place du logger */
const get_all_formules = async (req, res) => {
	let results = null;
	results = await db.formule.findAll();
	if(results.length <= 0) {
		log.error("il n'y a pas de formule enregistré");
	}
	return res.status(200).send(results);
};

const get_one_formule = async (req, res) => {
	const { id } = req.params;
	let formule = null;
	formule = await db.formule.findAll({ where: { id: id } });
	res.status(200).send({ formule });
};

const update_formule = async (req, res) => {
	const { id } = req.params;
	await db.formule.update(req.body, { where: { id: id } });
	res.status(200).send("La formule a bien été modifiée");
};

const delete_formule = async (req, res) => {
	const { id } = req.params;
	await db.formule.destroy({ where: {id: id } });
	res.status(200).send("La formule a bien été supprimée");
};


module.exports = {
	add_formule,
	get_one_formule,
	delete_formule,
	update_formule,
	get_all_formules,
};
