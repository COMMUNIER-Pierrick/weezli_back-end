const {loginValidation, registerValidation, updateValidation} = require("../config/validation");
const User = require("../services/models/User");
const log = require("../log/logger");
const userDAO = require("../services/database/dao/userDAO");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const insert = async (req, res) => {
	const { firstname, lastname, username, password, email, dateOfBirthday} = req.body.user;
	const { error } = registerValidation(req.body.user);
	if(error){
		log.error("Error register : " + error.details[0].message);
		return res.status(400).send({ error: error.details[0].message });
	}
	try {
		const userControl = await userDAO.getControlUser(email, username);
		if (userControl.length) {
			return res.status(409).send({error: "L'email ou le username existe deja"});
		}

		if(compareDate(dateOfBirthday)){
			return res.status(409).send({error: "Vous ne pouvez pas utilisez l'application car vous êtes mineur."});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = User.UserInsert(firstname, lastname, username, hashedPassword, email, dateOfBirthday);

		const user = await userDAO.insert(newUser);

		let playoad = {id: user.id};

		const token = jwt.sign(playoad, process.env.TOKEN_SECRET, {expiresIn: "30m"});
		let refreshToken = jwt.sign(playoad, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1y"});

		delete user.password;

		return res
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
			.status(201).send({success: "Votre compte a bien été créée", User: user});
	}catch (error) {
		log.error("Error user.js Register");
		throw error;
	}
};

const update = async (req, res) => {
	const {id} = req.params;
	const {user} = req.body;
	const { error } = updateValidation(user);
	if(error){
		log.error("Error update : " + error.details[0].message);
		return res.status(400).send({ error: error.details[0].message });
	}
	try{
		const newUser = await userDAO.update(user,id);
		delete newUser.password;
		const message = "mise à jour réussi.";
		res.status(200).send( {"message": message, "user": newUser} );
	}catch (error) {
		log.error("Error user.js update");
		throw error;
	}
};

const updatePayment = async (req, res) => {

}

const updateChoiceUser = async (req, res) => {
	const {id} = req.params;
	const { user } = req.body;
	const updateUser = await userDAO.updateChoiceUser(user, id);
	console.log(updateUser);
	const message = "mise à jour de votre formule."
	res.status(200).send({"message": message, "user": updateUser})
}

const remove = async (req, res) => {

};

const getById = async (req, res) => {
	const {id} = req.params;
	let user = null;
	user = await userDAO.getById(id);
	res.status(200).send( {"user": user} );
};

const login = async (req, res) => {
	const {email, password} = req.body.user;
	const {error}  = loginValidation(req.body.user);

	if (error){
		log.error("Error login : " + error.details[0].message );
		return res.status(400).send({ error: error.details[0].message });
	}

	try {
		const user = await userDAO.getByLogin(email);
		if (!user) {
			return res.status(401).send({ error: "L'identiant ou le mot de passe est erroné !" });
		}

		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res.status(401).send({ error: "Le mot de passe est erroné !" });
		}

		if (!user.active) {
			return res.status(403).send({ error: "Votre compte a été désactivé. Merci de contacter un administrateur." });
		}

		let playoad = {id: user.id};

		const token = jwt.sign(playoad, process.env.TOKEN_SECRET, {expiresIn: "30m"});
		let refreshToken = jwt.sign(playoad, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1y"});

		delete user.password;

		return res
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
			.status(201).send({success: "Connection réusse", User: user});
	} catch (error) {
		log.error("Error user.js login : " + error);
	}

};

const logout = (req, res) => {
	res
		.clearCookie("refreshToken")
		.clearCookie("refTokenId")
		.clearCookie("accessToken");
	res.status(204).send("delete complete");
};

const refresh = (req, res) => {
	let refreshToken = req.cookies.refreshToken;

	let payload;
	try {
		payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
	} catch (e) {
		log.error("Error user.js refresh : " + e);
		return res.status(403).send();
	}

	let newToken = jwt.sign({ id: payload.id }, process.env.TOKEN_SECRET, {
		expiresIn: "30m",
	});

	res
		.cookie("accessToken", newToken, {
			httpOnly: true,
			secure: false,
			sameSite: "strict",
		})
		.json({ newToken });
};

module.exports = {
	login,
	getById,
	insert,
	update,
	updateChoiceUser,
	updatePayment,
	remove,
	logout,
	refresh
};

function compareDate(dateOfBirthday){
	let dateBirthday = new Date(dateOfBirthday);
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth();
	let day = today.getDate();
	let yearsBack18= new Date(year - 18, month, day);
	if(yearsBack18 < dateBirthday ){
		return true;
	}
}

/*UPDATE PROFILE

*{
    "user": {
        "firstname": "paul",
        "lastname": "position",
        "email": "paul@pausition.com",
        "phone": null,
        "url_profile_img": null,
        "check": {
            "id": 13,
            "imgIdentity": "picture789.png"
        }
    }
}
* */

