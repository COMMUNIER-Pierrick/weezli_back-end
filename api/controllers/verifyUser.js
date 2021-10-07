const checkDAO = require("../services/database/dao/checkUserDAO");
const log = require("../log/logger");

const emailVerif = async (req, res) => {
    const {confirmCode} = req.params;

    try {

        const [checkUser] = await checkDAO.getByCode(confirmCode);
        if (!checkUser) {
            return res.status(404).send({"Message": "Aucun utilisateur enregistrée"});
        }
        await checkDAO.updateActive(checkUser.id);

        return res.status(200).send({"Message": "Email confirmé, vous pouvez vous connecter !"})

    }catch (error) {
        log.error("Error veriUser.js emailVerif");
        throw error;
    }
}

module.exports = {
    emailVerif
}
