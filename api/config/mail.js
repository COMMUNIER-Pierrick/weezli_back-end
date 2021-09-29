const nodemailer = require("nodemailer");
const log = require("../log/logger");

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user:process.env.GMAIL_USER,
        pass:process.env.GMAIL_PASS
    },
});

async function sendConfirmationEmail(name, email, confirmCode){
    console.log("Check");
    console.log(confirmCode);

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:5000/api/confirm/${confirmCode}> Click here</a>
        </div>`,
    };

    transport.sendMail(mailOptions, function(error, info){
        if (error) {
            log.error("Erreur lors de l'envoie du mail dans mail.js :  " + error);
            //res.send({error: "Le serveur ne repond pas"});
            console.log("erreur dans l'envoie du mail");
        } else {
            //res.send({succes: "envoie réussi"} )
            console.log("envoie reussi");
        }
    });
}

module.exports = {sendConfirmationEmail};
