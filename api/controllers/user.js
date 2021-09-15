const {loginValidation} = require("../config/validation");
const log = require("../log/logger");
const userDAO = require("../services/database/dao/userDAO");
const jwt = require("jsonwebtoken");

const insert = async (req, res) => {

};
const update = async (req, res) => {

};

const remove = async (req, res) => {

};

const getById = async (req, res) => {

};
const login = async (req, res) => {

};

module.exports = {
	login,
	getById,
	insert,
	update,
	remove
};
/*
const login = async (req, res) => {
	const {email, password} = req.body;
	const {error}  = loginValidation(req.body);

	if (error){
		log.error("Error login : " + error.details[0].message );
		return res.status(400).send({ error: error.details[0].message });
	}

	try {
		const [user] = await userDAO.selectOneUser(identifier);
		if (!user) {
			return res
				.status(401)
				.send({ error: "L'identiant ou le mot de passe est erroné !" });
		}

		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res
				.status(401)
				.send({ error: "L'identiant ou le mot de passe est erroné !" });
		}

		if (!user.active) {
			return res
				.status(403)
				.send({ error: "Votre compte a été désactivé. Merci de contacter un administrateur." });
		}

		let payload = { id: user.id };

		const token = jwt.sign(payload, process.env.token, {
			expiresIn: "30m",
		});
		let refreshToken = jwt.sign(payload, process.env.refreshToken, {
			expiresIn: "1y",
		});

		delete user.password;

		res
			.cookie("accessToken", token, {
				httpOnly: true,
				secure: false,
				sameSite: "strict",
			})
			.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: false,
				sameSite: "strict",
			})
			.cookie("refTokenId", true)
			.send(user);
	} catch (error) {
		log.error("Error user.js login : " + error);
	}
}
*/

