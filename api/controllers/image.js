const path = require('path');
const fs = require('fs');
const fileDAO = require("../services/database/dao/fileDAO");
const log = require("../log/logger");
const {upload} = require("../config/image-config")

const singleFileUpload = async (req, res, next) => {
    upload.single('file');
    const filename = req.file.filename
    try{
        if(filename){
            await fileDAO.insert(filename);
            res.status(201).send({message:"file uploaded successfully", filename})
        }
    }catch (error){
        log.error("Error controller image.js delete file : " + error);
        return res.status(500).send({ error: {code: 1001, message: 'File not uploaded'}});
    }
}

const deleteFile = async (req, res, next) => {
    const filename = req.body.filename;
    console.log(filename);
    try{
        if(filename){
            await fileDAO.remove(filename);
        }
        res.status(200).send({message: "Suppression réussi"});
    }catch (error){
        log.error("Error controller image.js delete file : " + error);
        return res.status(403).send({"Message": "Erreur dans la suppression du fichier"});
    }

}

module.exports = {
    singleFileUpload,
    deleteFile
};
