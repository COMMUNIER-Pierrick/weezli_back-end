require("dotenv").config();
const cookieParser = require('cookie-parser');
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.port || 5000;

const http = require("http").createServer(app);
require("./config/socket")(http);

app.use(express.json());
app.use(cookieParser());
//app.use(cors({origin: `process.env.url.front`}));
app.use('/images', express.static('uploads'));
//app.use(express.urlencoded({ extended: true }));

app.use("/user", require("./routes/users"));
app.use("/announce", require("./routes/announce"));
app.use("/size", require("./routes/size"));
app.use("/status", require("./routes/status"));
app.use("/transport", require("./routes/transport"));
app.use("/api", require("./routes/verifyUser"));
app.use("/image", require("./routes/image"));
app.use("/order", require ("./routes/order"));
app.use("/proposition", require("./routes/proposition"));
app.use("/status-proposition", require("./routes/status_proposition"));
app.use("/opinion", require("./routes/opinion"));

try{
    http.listen(port, () => {
        console.info("Server listening on port : " + port);
    });
} catch(e) {
    console.log("Server error on port : " + port);
}


