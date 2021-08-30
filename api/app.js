const express = require("express");
const passport = require("passport");
require("dotenv").config();
const db = require("./sources/models");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(passport.initialize());
const passportMiddleware = require("./sources/middlewares/passport");
passport.use(passportMiddleware);

app.use("/auth", require("./routes/authentication"));
app.use("/announces", require("./routes/announces"));
app.use("/user", require("./routes/user"));
app.use("/formule", require("./routes/formules"));
app.use("/colis", require("./routes/colis"));

// db.sequelize.sync({ force: true }).then(() => {
app.listen(port, () => {
	console.log("API listening in port " + port);
});
// });
