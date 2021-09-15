const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
	const token = req.cookies.accessToken;

	if (!token) return res.status(401).send("Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête");
	let payload;
	try{
		payload = jwt.verify(token, process.env.token);
		req.user = payload;
		next();
	}catch(error){
		res.status(403).send("Invalid token");
	}
};

module.exports = auth;
