const database = require("../tools/database");
const log = require("../../../log/logger");
const addressDAO = require("./addressDAO");
const packageDAO = require("./packageDAO");
const sizeDAO = require("./sizeDAO");
const transportDAO = require("./transportDAO");
const finalPriceDAO = require("./finalPriceDAO");
const Package = require("../../models/Package");
const Announce = require("../../models/Announce");
const userDAO = require("./userDAO");

const SQL_DELETE = `DELETE FROM announce WHERE  id = ?`
const SQL_INSERT_WITH_FINAL_PRICE = `INSERT INTO announce SET id_package = ?, id_final_price = ?, id_type = ?, price = ?, transact = ?, img_url = ?`;
const SQL_UPDATE = `UPDATE announce SET id_type = ?, price = ?, transact = ?, img_url = ? WHERE id =?`;

const SELECT_BY_ID = `SELECT a.id, a.id_package, a.views, a.id_final_price, a.id_order, a.id_type, a.price, a.transact, 
        a.img_url, a.date_created, fp.id AS id_final, fp.proposition, fp.accept
        FROM announce a
        INNER JOIN final_price fp ON a.id_final_price = fp.id
        WHERE a.id = ?`;
const SELECT_BY_TYPE = `SELECT a.id, a.id_package, a.views, a.id_final_price, a.id_order, a.id_type, a.price, a.transact, 
        a.img_url, a.date_created, fp.id AS id_final, fp.proposition, fp.accept
        FROM announce a
        INNER JOIN final_price fp ON a.id_final_price = fp.id
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

async function update(announce){
    let con = null;
    try{
        con = await database.getConnection();
        /* NON FINI !!!!! */
        /*Addresse de départ*/
        await addressDAO.update(announce.packages.addressDeparture);
        /*Addresse  d'arrivée*/
        await addressDAO.update(announce.packages.addressArrival);
        /* package */
        await packageDAO.update(announce.packages);
        /* annonce */
        await con.execute(SQL_UPDATE, [announce.idType, announce.price, announce.transact,
            announce.imgUrl, announce.id]);

        const results = await getById(announce.id);
        return results;
    }catch (error) {
        log.error("Error announceDAO update : " + error);
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
        const [ transport ] = await transportDAO.getById(packages.id_transport);
        const newPackage = new Package(packages.id, address1, address2, packages.datetime_departure, packages.datetime_arrival, packages.kg_available, packages.description_condition, transport, sizes);
        const newAnnonce = new Announce(announce[0].id, newPackage, announce[0].views, announce[0].id_type, announce[0].price, announce[0].transact, announce[0].img_url, announce[0].date_created, user);
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

async function remove(id){
    let con = null;
    try{
        con = await database.getConnection();
        const announce = await getById(id);
        //delete relation address
        await addressDAO.removeRelation(announce.packages.id, announce.packages.addressDeparture.id);
        await addressDAO.removeRelation(announce.packages.id, announce.packages.addressArrival.id);
        // delete relation size
        const size = announce.packages.sizes;
        for(let i = 0; i < size.length; i++){
            await sizeDAO.removeRelation(announce.packages.id, size[i]);
        }
        // delete relation user
        await userDAO.removeRelationAnnounce(announce.id, announce.userAnnounce.id);
        // delete address
        await addressDAO.remove(announce.packages.addressDeparture.id);
        await addressDAO.remove(announce.packages.addressArrival.id);
        // delete package
        await packageDAO.remove(announce.packages.id);
        //delete announce
        await con.execute(SQL_DELETE, [id]);
    }catch (error) {
        log.error("Error announceDAO remove : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByType(idType){
    let con = null;
    try {
        con = await database.getConnection();
        const [announces] = await con.execute(SELECT_BY_TYPE, [idType]);
        let newListAnnounce = [];
        for(let i = 0; i < announces.length; i++){
            let packageId = announces[i].id_package;
            const [packages] = await packageDAO.getById(packageId);
            const [address1] = await addressDAO.getByPackage(packageId, "depart");
            const [address2] = await addressDAO.getByPackage(packageId, "arrival");
            const [sizes] = await sizeDAO.getByPackage(packageId);
            const [user] = await userDAO.getUserForAnnounceByAnnounce(announces[i].id);
            const [ transport ] = await transportDAO.getById(packages.id_transport);
            const newPackage = new Package(packages.id, address1, address2, packages.datetime_departure, packages.datetime_arrival, packages.kg_available, packages.description_condition, transport, sizes);
            const announce = new Announce(announces[0].id, newPackage, announces[0].views, announces[0].id_type, announces[0].price, announces[0].transact, announces[0].img_url, announces[0].date_created, user);
            newListAnnounce.push({announce});
        }
        return newListAnnounce;
    } catch (error) {
        log.error("Error announceDAO selectByType : " + error);
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
    getByType,
    getById
}

/*
VERSION ENVOYER AU BACK

{   "announce":
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

VERSION RECUPERER

{
    "announce": {
        "id": 1,
        "packages": {
            "id": 1,
            "addressDeparture": {
                "id": 1,
                "name": "depart",
                "number": 45,
                "street": "Orange St",
                "additional_address": "3eme floor",
                "zipcode": "SW1Y 4UR",
                "city": "London",
                "country": "England"
            },
            "addressArrival": {
                "id": 3,
                "name": "arrival",
                "number": 28,
                "street": "Avenue des Champs-Elysées",
                "additional_address": "",
                "zipcode": "75000",
                "city": "Paris",
                "country": "France"
            },
            "datetimeDeparture": null,
            "datetimeArrival": "2021-11-27T23:00:00.000Z",
            "kgAvailable": 6.5,
            "description": "Maecenas consectetur, magna nec pretium faucibus, ipsum urna dapibus dolor, ac ornare est purus et velit",
            "transport": {
                "id": 1,
                "name": "non-identifier"
            },
            "sizes": [
                2,
                3
            ]
        },
        "views": 10,
        "idType": 1,
        "price": null,
        "transact": 0,
        "imgUrl": "picture15052021.png, picture15052021.png",
        "dateCreated": "2021-10-31T23:00:00.000Z",
        "userAnnounce": {
            "id": 1,
            "firstname": "alain",
            "lastname": "terrieur"
        }
    }
}
* */




