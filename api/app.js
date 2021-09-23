require("dotenv").config();
const cookieParser = require('cookie-parser');
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.port || 5000;

const http = require("http").createServer(app);

app.use(express.json());
app.use(cookieParser());
//app.use(cors({origin: `process.env.url.front`}));

//app.use(express.urlencoded({ extended: true }));

app.use("/user", require("./routes/users"));
app.use("/announce", require("./routes/announce"));
app.use("/choice", require("./routes/choice"));
app.use("/size", require("./routes/size"));
app.use("/status", require("./routes/status"));
app.use("/transport", require("./routes/transport"));


try{
    http.listen(port, () => {
        console.info("Server listening on port : " + port);
    });
} catch(e) {
    console.log("Server error on port : " + port);
}


