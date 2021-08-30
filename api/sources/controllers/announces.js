const db = require("../models");

const add_new_announce = async (req, res) => {
	const {
		adress_departure,
		adress_arrival,
		datetime_departure,
		datetime_arrival,
		kg_available,
		kg_price,
		kg_wanted,
		list_objects,
		description_conditions,
		userId,
		type,
	} = req.body;
	let results = null;

	if (type === "selling") {
		results = await db.seller_annonce.create({
			adress_departure,
			adress_arrival,
			datetime_departure,
			datetime_arrival,
			kg_available,
			kg_price,
			dimensions,
			travel_mode,
			description_conditions,
			userId,
		});
	}
	if (type === "buying") {
		results = await db.buyer_annonce.create({
			adress_departure,
			adress_arrival,
			kg_wanted,
			list_objects,
			userId,
		});
	}
	return res.status(200).send("L'annonce a bien été créer");
};

const get_all_announce = async (req, res) => {
	const { type } = req.params;
	let results = null;
	if (type === "selling") {
		results = await db.seller_annonce.findAll({
			include: [
				{ model: db.user, as: "user", attributes: { exclude: "password" } },
			],
		});
	}
	if (type === "buying") {
		results = await db.buyer_annonce.findAll({
			include: [
				{ model: db.user, as: "user", attributes: { exclude: "password" } },
			],
		});
	}

	res.status(200).send(results);
};

const update_announce = async (req, res) => {
	const { id, type } = req.params;
	if (type === "selling") {
		await db.seller_annonce.update(req.body, { where: { id: id } });
	}
	if (type === "buying") {
		await db.buyer_annonce.update(req.body, { where: { id: id } });
	}

	res.status(200).send("L'annonce a bien été modifier");
};

const delete_announce = async (req, res) => {
	const { id, type } = req.params;
	if (type === "selling") {
		await db.seller_annonce.destroy({
			where: {
				id: id,
			},
		});
	}
	if (type === "buying") {
		await db.buyer_annonce.destroy({
			where: {
				id: id,
			},
		});
	}

	res.status(200).send("Annonce supprimée");
};

const get_user_announces = async (req, res) => {
	const { type, id } = req.params;
	let announces = null;
	if (type === "selling") {
		announces = await db.seller_annonce.findAll({
			where: { userId: id },
		});
	}
	if (type === "buying") {
		announces = await db.buyer_annonce.findAll({
			where: { userId: id },
		});
	}

	res.status(200).send({ announces });
};

module.exports = {
	add_new_announce,
	get_user_announces,
	delete_announce,
	update_announce,
	get_all_announce,
};
