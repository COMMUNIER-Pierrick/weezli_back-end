const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

const login = async (req, res) => {
	const { identifier, password } = req.body;

	if (!identifier || !password) {
		return res
			.status(400)
			.send({ msg: "You need to send email or username and password" });
	}

	const user = await db.user.findOne({
		where: {
			[Op.or]: [{ email: identifier }, { username: identifier }],
		},
	});

	if (!user) {
		return res.status(400).send({ msg: "The user does not exist" });
	}

	const comparePassword = await bcrypt.compare(password, user.password);
	if (!comparePassword)
		return res
			.status(401)
			.send({ error: "L'identiant ou le mot de passe est erroné !" });

	let payload = { id: user.id };

	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: 86400,
	});

	return res.status(200).send({ token });
};

const register = async (req, res) => {
	const { username, email, lastname, firstname, password, phone } = req.body;

	const user = await db.user.findOne({
		where: {
			[Op.or]: [{ email: email }, { username: username }],
		},
	});

	if (user) {
		return res
			.status(400)
			.send({ msg: "The email or the username already exists" });
	} else {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		db.user
			.create({
				username,
				email,
				lastname,
				firstname,
				password: hashedPassword,
				phone,
				createdAt: moment().format("Y-MM-DD H:m:ss"),
			})
			.then((user) => {
				delete user.password;
				return res.status(201).send({
					success: "Votre compte a bien été enregistré",
					newUser: user,
				});
			})
			.catch((err) => console.log(err));
	}
};

module.exports = {
	login,
	register,
};
