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

const getById = async (req, res) => {

    const {id} = req.params;
    const [checkUser] = await checkDAO.getById(id);
    res.status(200).send( {"Check": checkUser} );
};

module.exports = {
    emailVerif,
    getById
}
