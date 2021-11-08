const {loginValidation, registerValidation, updateValidation} = require("../config/validation");
const User = require("../services/models/User");
const log = require("../log/logger");
const userDAO = require("../services/database/dao/userDAO");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mail = require("../config/mail");
const checkDAO = require("../services/database/dao/checkUserDAO");
const fileDAO = require("../services/database/dao/fileDAO");
const announceDAO = require("../services/database/dao/announceDAO");
const paymentDAO = require("../services/database/dao/paymentDAO");

const insert = async (req, res) => {
	const { firstname, lastname, username, password, email, dateOfBirthday, address} = req.body.User;
	const { error } = registerValidation(req.body.User);
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
		const newUser = User.UserInsert(firstname, lastname, username, hashedPassword, email, dateOfBirthday, address);

		const user = await userDAO.insert(newUser);

		let playoad = {id: user.id};

		const token = jwt.sign(playoad, process.env.TOKEN_SECRET, {expiresIn: "30m"});
		let refreshToken = jwt.sign(playoad, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1y"});

		const [check] = await checkDAO.updateCode(token, user.check.id)
		const emailSend = await mail.sendConfirmationEmail( user.lastname, user.email, check.confirm_code);

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
			.status(201).send({"Message": "Votre compte a bien été créé, merci de verifier vos mail pour confirmer votre email e ou vos spams", "User": user, "EmailSend": emailSend});
	}catch (error) {
		log.error("Error userDAO.js Register");
		throw error;
	}
};

const update = async (req, res) => {
	let file = '';
	let filecheck = '';
	const {id} = req.params;
	//const {User} = req.body;
	let userParse = JSON.parse(req.body.User);
	const user = User.UserUpdate(userParse.firstname, userParse.lastname, userParse.email, userParse.phone, userParse.check, userParse.address);
	//const user = User.UserUpdate(User.firstname, User.lastname, User.email, User.phone,User.check, User.address);

	req.files.forEach(el => el.fieldname === 'file' ? file = el : el.fieldname === 'filecheck' ? filecheck = el : '');

	const { error } = updateValidation(User);
	if(error){
		log.error("Error update : " + error.details[0].message);
		return res.status(400).send({ error: error.details[0].message });
	}
	const userback = await userDAO.getById(id);

	if(file){
		if(userback.filename !== file.filename){
			if(userback.filename !== ''){
				await fileDAO.remove(userback.filename)
			}
			await fileDAO.insert(file.filename);
		}
	}else if(!file && userback.filename){
		await fileDAO.remove(userback.filename);
	}

	if(filecheck){
		if(userback.check.filename !== filecheck.filename){
			if(userback.check.filename !== ''){
				await fileDAO.remove(userback.check.filename)
			}
			await fileDAO.insert(filecheck.filename);
		}
	}else if(!filecheck && userback.check.filename){
		await fileDAO.remove(userback.check.filename);
	}

	try{
		const newUser = await userDAO.update(user, file.filename, filecheck.filename, id);
		delete newUser.password;
		const message = "mise à jour réussi.";
		res.status(200).send( {"Message": message, "User": newUser} );
	}catch (error) {
		log.error("Error userDAO.js update");
		throw error;
	}
};

const updatePayment = async (req, res) => {

}

const updateChoiceUser = async (req, res) => {
	const {id} = req.params;
	const { user } = req.body;
	const updateUser = await userDAO.updateChoiceUser(user, id);
	const message = "mise à jour de votre formule."
	res.status(200).send({"Message": message, "User": updateUser})
}

/*NON Implémanté*/
const remove = async (req, res) => {
	/*
	const {id} = req.params;
	const user = await userDAO.getById(id);
	//récuperer tout les annonces de l'utilisateur
    const announces = await announceDAO.getAllUser(id);
    // supprimer tout les annonces
    if(announces){
    	announces.forEach(el => announceDAO.remove(el.Announce.id));
    }
	if(user.filename){
		await fileDAO.remove(user.filename);
	}
	if(user.check.filename){
		await fileDAO.remove(user.check.filename);
	}
	console.log("check");

	await userDAO.remove(id);
	await paymentDAO.remove(user.payment.id);
	await checkDAO.remove(user.check.id);
	const message = "L'utilisateur a bien été supprimer."
	res.status(200).send( {"Message": message});*/
};

const getById = async (req, res) => {
	const {id} = req.params;
	const user = await userDAO.getById(id);
	res.status(200).send( {"User": user} );
};

const login = async (req, res) => {
	const {email, password} = req.body.User;
	const {error}  = loginValidation(req.body.User);

	if (error){
		log.error("Error login : " + error.details[0].message );
		return res.status(400).send({ error: error.details[0].message });
	}

	try {
		const user = await userDAO.getByLogin(email);
		if (!user) {
			return res.status(401).send({ "Error": "L'identiant ou le mot de passe est erroné !" });
		}
		if(user.check.status !== "Active"){
			return res.status(401).send({ "Error": "Votre compte est en attente, merci de verifier votre email !" });
		}

		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res.status(401).send({ "Error": "Le mot de passe est erroné !" });
		}

		if (!user.active) {
			return res.status(403).send({ "Error": "Votre compte a été désactivé. Merci de contacter un administrateur." });
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
			.status(201).send({"Message": "Connection réussie", "User": user});
	} catch (error) {
		log.error("Error userDAO.js login : " + error);
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
		log.error("Error userDAO.js refresh : " + e);
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

*{"User": {
        "firstname": "vincent",
        "lastname": "colas",
        "email": "vinc.tigra@gmail.com",
        "phone": "0707070707",
        "check": {
            "id": 37,
            "imgIdentity": ""
        },
        "address" : {
            "id": 5,
            "idInfo": 3,
            "number" : 36,
            "street": "rue crébillion",
            "additionalAddress" : "",
            "zipCode": 44000,
            "city" : "Nantes",
            "country": "France"
        }
    }
}
* */

