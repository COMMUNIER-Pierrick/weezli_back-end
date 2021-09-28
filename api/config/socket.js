const socket = (http) => {
    const io = require("socket.io")(http, {
        cors: {
            origin: "*",
            methods: ["*"],
        },
    });

    console.log("test de connection");



    io.on("connection", (socket) => {
        console.log("connecté ");
        socket.on("create-item", ({type, data}) => {
            console.log("entrée dans create item : " + type + " " );
            if(type === "message") {
                console.log(data.text);
            }
        })

    });
}

module.exports = socket;

/*
* {
    "type": "message",
    "data": {
            "text": "test de connection au back"
        }
}
* */
