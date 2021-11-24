const database = require("../tools/database");
const log = require("../../../log/logger");
const Opinion = require("../../models/Opinion");
const RelationOpinionUser = require("../../models/RelationOpinionUser");

const SQL_INSERT = `INSERT INTO opinion SET number = ?, comment = ?, id_user = ?, status = ?`;
const SQL_INSERT_RELATION = `INSERT INTO rel_opinion_users SET id_opinion = ?, id_user = ?, id_order = ?, id_types = ?`;
const SQL_UPDATE = `UPDATE opinion SET number = ?, comment = ?, status = ? WHERE id = ?`;
const SELECT_BY_ID = `SELECT * FROM opinion WHERE id = ?`;
const SELECT_ALL_OPINION_BY_USER = `SELECT o.id, o.number, o.comment,o.id_user, o.status, rou.id_opinion, rou.id_user as userRelation, rou.id_order, rou.id_types
                                    FROM opinion o
                                    INNER JOIN rel_opinion_users rou ON o.id = rou.id_opinion 
                                    WHERE rou.id_user = ?`;
const SELECT_ALL_OPINION_BY_ORDER = `SELECT o.id, o.number, o.comment,o.id_user, o.status, rou.id_opinion, rou.id_user as userRelation, rou.id_order, rou.id_types 
                                    FROM opinion o
                                    INNER JOIN rel_opinion_users rou ON o.id = rou.id_opinion
                                    WHERE id_order = ?`;
const SELECT_ALL_OPINION_USER_BY_USER = `SELECT o.id, o.number, o.comment,o.id_user, o.status, rou.id_opinion, rou.id_user as userRelation, rou.id_order, rou.id_types FROM opinion o
                                        INNER JOIN rel_opinion_users rou ON o.id = rou.id_opinion
                                        WHERE (o.id_user = ? AND rou.id_user = ?) OR (o.id_user = ? AND rou.id_user = ?)`;
const SELECT_BY_ID_WITH_RELATION = `SELECT o.id, o.number, o.comment,o.id_user, o.status, rou.id_opinion, rou.id_user as userRelation, rou.id_order, rou.id_types
                                    FROM opinion o
                                    INNER JOIN rel_opinion_users rou on o.id = rou.id_opinion
                                    WHERE o.id = ? AND rou.id_user = ? AND rou.id_order = ?`;

async function getById(id){
    let con = null;
    try {
        con = await database.getConnection();
        const [o] = await con.execute(SELECT_BY_ID, [id]);
        const opinion = new Opinion(o[0].id, o[0].number, o[0].comment, o[0].id_user, o[0].status);
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

async function getByIdWithRelation(id,idUser, idOrder){
    let con = null;
    try {
        con = await database.getConnection();
        const [o] = await con.execute(SELECT_BY_ID_WITH_RELATION, [id, idUser, idOrder]);
        if( o.length === 0){
            console.log(o[0]);
            return [];
        }else{
            const opinion = new Opinion(o[0].id, o[0].number, o[0].comment, o[0].id_user, o[0].status);
            const relOpinionUser = new RelationOpinionUser(o[0].id_opinion, o[0].id_user, o[0].id_order, o[0].id_types);
            return ({"Opinion": opinion, "RelOpinionUser": relOpinionUser});
        }
    } catch (error) {
        log.error("Error getByIdWithRelation : " + error);
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
        const opinionUpdate = await con.execute(SQL_UPDATE, [newOpinion.number, newOpinion.comment, newOpinion.status, newOpinion.id]);
        const opinion = await getById(newOpinion.id);
        return opinion;
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
    const number = 0;
    const comment = "";
    const status = "Pending";
    try {
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [number, comment, status, id]);
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
    insertRealtion,
    getByIdWithRelation
};
