const db = require("../models");

const updateUser = (req, res) => {
	db.user
		.update(req.body, { where: { id: req.user.id } })
		.then(() => res.status(200).send("Votre profil a bien été mise à jour"));
};

const getMyInfo = (req, res) => {
	res.status(200).send(req.user);
};

const getUserInfo = (req, res) => {
	const { id } = req.params;
	db.user
		.findByPk(id, { attributes: { exclude: "password" } })
		.then((user) => res.status(200).send(user));
};

module.exports = {
	updateUser,
	getMyInfo,
	getUserInfo,
};
