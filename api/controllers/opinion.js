const Opinion = require("../services/models/Opinion");
const opinionDAO = require("../services/database/dao/opinionDAO");
const log = require("../log/logger");

const getById = async (req, res) => {
    try{
        const {id} = req.params;
        const opinion = await opinionDAO.getById(id);
        res.status(200).send({"Opinion": opinion})
    }catch (error) {
        log.error("Error getById controller : " + error);
    }
}

const getAllOpinionByUser = async (req, res) => {
    try {
        const {idUser} = req.params;
        const opinion = await opinionDAO.getAllOpinionByUser(idUser);
        res.status(200).send( {"Opinions": opinion} );
    }catch (error) {
            log.error("Error getAllOpinionByUser controller : " + error);
    }
};

const getOpinionByOrder = async (req, res) => {
    try {
        const {idOrder} = req.params;
        const opinion = await opinionDAO.getOpinionByOrder(idOrder);
        res.status(200).send( {"Opinion": opinion} );
    }catch (error) {
        log.error("Error getOpinionByOrder controller : " + error);
    }
}

const insert = async (req, res) => {
    try{
        const {number, comment, idOrder} = req.body.Opinion;
        const newOpinion = Opinion.OpinionInsert(number, comment, idOrder);
        const opinion = await opinionDAO.insert(newOpinion);
        res.status(200).send({"Opinion": opinion});
    }catch (error) {
        log.error("Error insert controller : " + error);
    }
}

const update = async (req, res) => {
    try{
        const {id} = req.params;
        const {number, comment} = req.body.Opinion;
        const newOpinion = Opinion.OpinionUpdate(id, number, comment);
        const opinion = await opinionDAO.update(newOpinion);
        res.status(200).send({"Opinion": opinion});
    }catch (error) {
        log.error("Error update controller : " + error);
    }
}

const remove = async (req, res) => {
    try{
        const {id} = req.params;
        await opinionDAO.remove(id);
        res.status(200).send( {"Message": "Suppression réussie"});
    }catch (error) {
        log.error("Error remove controller : " + error);
    }
}

module.exports = {
    insert,
    remove,
    update,
    getAllOpinionByUser,
    getOpinionByOrder,
    getById
};
