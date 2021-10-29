const database = require('../tools/database');
const log = require('../../../log/logger');
const Choice = require('../../models/Choice');

const SELECT_ALL = `SELECT * from choice`;
const SELECT_BY_ID = `SELECT * from choice WHERE id = ?`;
const SQL_INSERT = `INSERT INTO choice SET name = ?, description = ?, price = ?`;
const SQL_UPDATE = `UPDATE choice SET name = ?, description = ?, price = ? WHERE id = ?`;
const SQL_DELETE = `DELETE FROM choice WHERE id = ?`;

const errorMessage = "Data access error";

async function getAll(){
    let con = null;
    try {
        con = await database.getConnection();
        const [rows] = await con.execute(SELECT_ALL);
        let newListChoice = [];
        for(let i = 0; i < rows.length; i++){
            const choice = rows[i];
            const newChoice = new Choice(choice.id, choice.name, choice.description, choice.price, choice.id_payment);
            newListChoice.push({"Choice" : newChoice});
        }
        return newListChoice;
    } catch (error) {
        log.error("Error ChoiceDAO selectAll : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function insert(Choice){
    let con = null;
    try{
        con = await database.getConnection();
        const [idCreated] = await con.execute(SQL_INSERT, [Choice.name, Choice.description, Choice.price]);
        const id = idCreated.insertId;
        const [result] = await getById(id)
        return result;
    }catch (error) {
        log.error("Error ChoiceDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function update(Choice, id){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_UPDATE, [Choice.name, Choice.description, Choice.price, id]);
        const [result] = await getById({id})
        return result;
    }catch (error) {
        log.error("Error ChoiceDAO update : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function remove({id}){
    let con = null;
    try{
        con = await database.getConnection();
        await con.execute(SQL_DELETE, [id]);
    }catch (error) {
        log.error("Error ChoiceDAO delete : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getById(id){
    let con = null;
    try {
        con = await database.getConnection();
        const [rows] = await con.execute(SELECT_BY_ID, [id]);
        return rows;
    } catch (error) {
        log.error("Error ChoiceDAO selectById : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

module.exports = {
    getAll,
    insert,
    update,
    remove,
    getById
}
