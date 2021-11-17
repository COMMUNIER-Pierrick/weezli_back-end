const database = require("../tools/database");
const log = require("../../../log/logger");
const Opinion = require("../../models/Opinion");

const SQL_INSERT = `INSERT INTO opinion SET number = ?, comment = ?, id_user = ?, status = ?`;
const SQL_INSERT_RELATION = `INSERT INTO rel_opinion_users SET id_opinion = ?, id_user = ?, id_order = ?, id_types = ?`;
const SELECT_BY_ID = `SELECT * FROM opinion WHERE id = ?`;
const SELECT_ALL_OPINION_BY_USER = `SELECT * FROM opinion WHERE id_user = ?`;
const SELECT_ALL_OPINION_BY_ORDER = `SELECT * FROM opinion
                                    INNER JOIN rel_opinion_users rou ON opinion.id = rou.id_opinion
                                    WHERE id_order = ?`;
const SELECT_ALL_OPINION_USER_BY_USER = `SELECT * FROM opinion o
                                        INNER JOIN rel_opinion_users rou ON o.id = rou.id_opinion
                                        WHERE (o.id_user = ? AND rou.id_user = ?) OR (o.id_user = ? AND rou.id_user = ?)`;

async function getById(id){
    let con = null;
    try {
        con = await database.getConnection();
        const [o] = await con.execute(SELECT_BY_ID, [id]);
        const opinion = new Opinion(o[0].id, o[0].number, o[0].comment, o[0].id_Order);
        return opinion;
    } catch (error) {
        log.error("Error getById : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getAllOpinionByUser(idUser){
    let con = null;
    try {
        con = await database.getConnection();
        const [listOpinion] = await con.execute(SELECT_ALL_OPINION_BY_USER, [idUser]);
        return listOpinion;
    } catch (error) {
        log.error("Error getAllOpinionByUser : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getOpinionByOrder(idOrder){
    let con = null;
    try {
        con = await database.getConnection();
        const [listOpinion] = await con.execute(SELECT_ALL_OPINION_BY_ORDER, [idOrder]);
        return listOpinion;
    } catch (error) {
        log.error("Error  : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getOpinionUserByUser(idLivreur, idExpediteur){
    let con = null;
    try {
        con = await database.getConnection();
        const [listOpinion] = await con.execute(SELECT_ALL_OPINION_USER_BY_USER, [idExpediteur, idLivreur, idLivreur, idExpediteur]);
        return listOpinion;
    } catch (error) {
        log.error("Error getOpinionUserByUser : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insert(idUser){
    let con = null;
    const number = 0;
    const comment = '';
    const status = 'Pending';
    try {
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [number, comment, idUser, status]);
        const id = idCreated.insertId;
        return id;
    } catch (error) {
        log.error("Error insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insertRealtion(idOpinion, idLivreur, idOrder, status){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT_RELATION, [idOpinion, idLivreur, idOrder, status])
        const id = idCreated.insertId;
        return id;
    } catch (error) {
        log.error("Error insertRelation : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(newOpinion){
    let con = null;
    try {
        con = await database.getConnection();

    } catch (error) {
        log.error("Error  : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function remove(id){
    let con = null;
    try {
        con = await database.getConnection();
        // juste désactiver et supprimer sle contenue
    } catch (error) {
        log.error("Error  : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

module.exports = {
    insert,
    remove,
    update,
    getAllOpinionByUser,
    getOpinionByOrder,
    getById,
    getOpinionUserByUser,
    insertRealtion
};
