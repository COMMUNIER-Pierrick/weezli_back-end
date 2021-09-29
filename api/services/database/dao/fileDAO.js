const log = require('../../../log/logger');
const fs = require("fs");
const path = require("path");

async function insert(filename){
    path.join(__dirname, 'uploads', filename);
}

async function remove(filename){
    await fs.unlinkSync("uploads/" + filename);
}

module.exports = {
    insert,
    remove,
}
