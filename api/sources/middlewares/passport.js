const db = require("../models");
const JwtStrategy = require("passport-jwt").Strategy,
	ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
	db.user
		.findByPk(jwt_payload.id, { attributes: { exclude: "password" } })
		.then((user) => {
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		})
		.catch((err) => {
			if (err) {
				return done(err, false);
			}
		});
});
