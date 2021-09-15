const database = require("../tools/database");
const log = require("../../../log/logger");
const addressDAO = require("./addressDAO");
const packageDAO = require("./packageDAO");
const sizeDAO = require("./sizeDAO");
const finalPriceDAO = require("./finalPriceDAO");
const Package = require("../../models/Package");
const Announce = require("../../models/Announce");
const userDAO = require("./userDAO");

const SQL_INSERT = `INSERT INTO announce SET id_package = ?, id_type = ?, price = ?, transact = ?, img_url = ?`;
const SQL_INSERT_WITH_FINAL_PRICE = `INSERT INTO announce SET id_package = ?, id_final_price = ?, id_type = ?, price = ?, transact = ?, img_url = ?`;

const SELECT_BY_ID = `SELECT a.id, a.id_package, a.views, a.id_final_price, a.id_order, a.id_type, a.price, a.transact, 
        a.img_url, a.date_created, fp.id, fp.proposition, fp.accept
        FROM announce a
        INNER JOIN final_price fp on fp.id = a.id_final_price
        WHERE a.id = ?`;
const SELECT_BY_TYPE = `SELECT a.id, a.id_package, a.views, a.id_final_price, a.id_order, a.id_type, a.price, a.transact, 
        a.img_url, a.date_created, fp.id, fp.proposition, fp.accept
        FROM announce a
        INNER JOIN final_price fp on fp.id = a.id_final_price
        WHERE a.id_type = ?`;

const errorMessage = "Data access error";

async function insert(announce){
    let con = null;
    try{
        con = await database.getConnection();
        /*Addresse de départ*/
        const AddressDeparture = await addressDAO.insert(announce.packages.addressDeparture);
        const idDepart = AddressDeparture.id;
        /*Addresse  d'arrivée*/
        const AddressArrival = await addressDAO.insert(announce.packages.addressArrival);
        const idArrival = AddressArrival.id;
        /*Insertion du package*/
        const Package = await packageDAO.insert(announce.packages);
        const idPack = Package.id;
        /* Insertion relation address*/
        await addressDAO.insertRelation(idPack, idDepart);
        await addressDAO.insertRelation(idPack, idArrival);
        /* Insertion relation size */
        const size = announce.packages.sizes;
        for(let i = 0; i < size.length; i++){
            await sizeDAO.insertRelation(idPack, size[i]);
        }

        let finalPrice = null;
        /*Insertion annonce en fonction de si transact is true*/
        if(announce.transact){
            finalPrice = await finalPriceDAO.insert(announce.price, true);
        }else{
            finalPrice = await finalPriceDAO.insert(0, false);
        }

        const [idCreated] = await con.execute(SQL_INSERT_WITH_FINAL_PRICE, [idPack, finalPrice.id, announce.idType, announce.price, announce.transact, announce.imgUrl]);
        const id = idCreated.insertId;

        /*insertion relation user annonce*/
        await userDAO.insertRelation(id, announce.userAnnounce.id);

        const results = await getById(id);
        return results;

    }catch (error) {
        log.error("Error announceDAO insert : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getById(id) {
    let con = null;
    try {
        con = await database.getConnection();
        const [announce] = await con.execute(SELECT_BY_ID, [id]);
        let packageId = announce[0].id_package;
        const [packages] = await packageDAO.getById(packageId);
        const [address1] = await addressDAO.getByPackage(packageId, "depart");
        const [address2] = await addressDAO.getByPackage(packageId, "arrival");
        const [sizes] = await sizeDAO.getByPackage(packageId);
        const [user] = await userDAO.getUserForAnnounceByAnnounce(id);
        const newPackage = new Package(address1, address2, packages.datetime_departure, packages.datetime_arrival, packages.kg_available, packages.description_condition, packages.id_transport, sizes);
        const newAnnonce = new Announce(newPackage, announce[0].id_type, announce[0].price, announce[0].transact, announce[0].img_url, announce[0].date_created, user);
        return newAnnonce;
    } catch (error) {
        log.error("Error announceDAO selectById : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function remove(){

}

async function update(){

}

async function getByType(idType){
    let con = null;
    try {
        con = await database.getConnection();
        const [announce] = await con.execute(SELECT_BY_TYPE, [idType]);


    } catch (error) {
        log.error("Error announceDAO selectById : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByUser(){
}

module.exports = {
    insert,
    remove,
    update,
    getByType,
    getById,
    getByUser
}

/*{   "announce":
        {
            "packages":
                {
                    "addressDeparture" :
                        {
                            "idInfo": 1,
                            "number" : 4,
                            "street": "rue de la soif",
                            "additionalAddress" : "",
                            "zipCode": 35000,
                            "city" : "Rennes",
                            "country": "France"
                        },
                    "addressArrival" :
                        {
                            "idInfo": 2,
                            "number" : 34,
                            "street": "stade de la beaujoire",
                            "additionalAddress" : "1er batiement",
                            "zipCode": 44000,
                            "city" : "Nantes",
                            "country": "France"
                        },
                    "datetimeDeparture" : "2021-10-19 03:14:07.999999",
                    "datetimeArrival" : "2021-11-19 03:14:07.999999",
                    "kgAvailable" : 46,
                    "description" : "",
                    "idTransport": 2,
                    "sizes": [2,3]
                },
            "idType" : 2,
            "price" : 25,
            "transact" : true,
            "imgUrl" : "picture15052021.png, picture15052022.png, picture15052023.png",
            "dateCreated" : "",
            "userAnnounce":
            {
                "id" : 1,
                "firstname" : "alain",
                "lastname" : "terieur"
            }
        }
}
* */




