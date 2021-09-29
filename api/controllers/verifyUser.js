const checkDAO = require("../services/database/dao/checkUserDAO");
const log = require("../log/logger");

const emailVerif = async (req, res) => {
    const {confirmCode} = req.params;
    console.log(confirmCode);
    try {
        const [checkUser] = await checkDAO.getByCode(confirmCode);
        console.log(checkUser);
        if (!checkUser) {
            return res.status(404).send({"Message": "Aucun utilisateur enregistrée"});
        }
        const check = await checkDAO.updateActive(checkUser.id);
        console.log("update reussi : " + check);

        return res.status(200).send({"Message": "Email confirmé, vous pouvez vous connecter !"})
    }catch (error) {
        log.error("Error veriUser.js emailVerif");
        throw error;
    }
}

module.exports = {
    emailVerif
}
