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
        const newAnnonce = Announce.AnnounceId(announce[0].id, newPackage, announce[0].views, announce[0].id_type, announce[0].price, announce[0].transact, announce[0].img_url, announce[0].date_created, user);
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
            const announce = Announce.AnnounceId(announces[i].id, newPackage, announces[i].views, announces[i].id_type, announces[i].price, announces[i].transact, announces[i].img_url, announces[i].date_created, user);
            newListAnnounce.push({"Announce": announce});
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

async function getSearch(condition, Search){
    let con = null;
    const SELECT_SEARCH = `SELECT DISTINCT a.id, a.id_package, a.views, a.id_final_price, a.id_order, a.id_type, a.price, a.transact,
                                           a.img_url, a.date_created, fp.id AS id_final, fp.proposition, fp.accept 
                            FROM announce a 
                            INNER JOIN package p ON a.id = p.id
                            INNER JOIN final_price fp ON a.id_final_price = fp.id    
                            INNER JOIN rel_package_address rpa_depart ON p.id = rpa_depart.id_package 
                            INNER JOIN rel_package_address rpa_arrival ON p.id = rpa_arrival.id_package 
                            INNER JOIN address ad_depart ON rpa_depart.id_address = ad_depart.id and ad_depart.id_info = 1 
                            INNER JOIN address ad_destination ON rpa_arrival.id_address = ad_destination.id and ad_destination.id_info = 2 
                            INNER JOIN rel_package_sizes rps ON p.id = rps.id_package 
                            INNER JOIN size s ON rps.id_size = s.id 
                            ${condition} `;

    try {
        con = await database.getConnection();
        const [announces] = await con.execute(SELECT_SEARCH, [Search.type, Search.transport, Search.departure, Search.arrival, Search.date, Search.kgAvailable]);
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
            const announce = Announce.AnnounceId(announces[i].id, newPackage, announces[i].views, announces[i].id_type, announces[i].price, announces[i].transact, announces[i].img_url, announces[i].date_created, user);
            newListAnnounce.push({"Announce": announce});
        }
        return newListAnnounce;
    } catch (error) {
        log.error("Error announceDAO search : " + error);
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
    getById,
    getSearch
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
                    "sizes": [
                {
                "size":{
                    "id": 1,
                    "name": "petit"
                    }
                },{
                "size": {
                    "id": 2,
                    "name": "moyen"
                    }
             }
            ]

        },
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
    "Announces": [
        {
            "Announce": {
                "id": 5,
                "packages": {
                    "id": 5,
                    "addressDeparture": {
                        "id": 2,
                        "name": "depart",
                        "number": 12,
                        "street": "Lalana Delord",
                        "additional_address": "",
                        "zipcode": "105",
                        "city": "Antananarivo",
                        "country": "Madagascar"
                    },
                    "addressArrival": {
                        "id": 4,
                        "name": "arrival",
                        "number": 55,
                        "street": "Liberty St",
                        "additional_address": "second door",
                        "zipcode": "10005",
                        "city": "Manhattan New York",
                        "country": "United States of America"
                    },
                    "datetimeDeparture": "2021-12-19T23:00:00.000Z",
                    "datetimeArrival": "2021-12-21T23:00:00.000Z",
                    "kgAvailable": 4,
                    "description": "",
                    "transport": {
                        "id": 5,
                        "name": "bateau"
                    },
                    "sizes": [
                        {
                            "id": 2,
                            "name": "moyen"
                        }
                    ]
                },
                "views": 1,
                "finalPrice": null,
                "order": null,
                "idType": 2,
                "price": 5,
                "transact": 0,
                "imgUrl": "",
                "dateCreated": "2021-11-09T23:00:00.000Z",
                "userAnnounce": {
                    "id": 2,
                    "firstname": "sarah",
                    "lastname": "croche",
                    "average_opinion": 2.5
                }
            }
        }
    ]
}
* */

/*
SELECT DISTINCT a.id as idAnnounce, p.id as idPackage, p.datetime_departure
FROM announce a
    INNER JOIN package p ON a.id = p.id
    INNER JOIN rel_package_address rpa_depart ON p.id = rpa_depart.id_package
    INNER JOIN rel_package_address rpa_arrival ON p.id = rpa_arrival.id_package
    INNER JOIN address ad_depart ON rpa_depart.id_address = ad_depart.id and ad_depart.id_info = 1
    INNER JOIN address ad_destination ON rpa_arrival.id_address = ad_destination.id and ad_destination.id_info = 2
    INNER JOIN rel_package_sizes rps ON p.id = rps.id_package
    INNER JOIN size s ON rps.id_size = s.id
WHERE a.id_type = 2 AND p.id_transport = 5 AND p.kg_available <= 6.5 AND ad_depart.city = 'Antananarivo'
                    AND ad_destination.city = 'Manhattan New York' AND p.datetime_departure < '2021-12-31T23:00:00' AND s.id in (1, 2, 3, 4) */

/*
* {
    "Search": {
        "departure": "Antananarivo",
        "arrival": "Manhattan New York",
        "date": "2021-12-31T23:00:00",
        "sizes": "",
        "kgAvailable": 6.5,
        "transport": 5,
        "type": 2
    }
}*/


