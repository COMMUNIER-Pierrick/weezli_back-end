const database = require("../tools/database");
const log = require("../../../log/logger");
const addressDAO = require("./addressDAO");
const packageDAO = require("./packageDAO");
const sizeDAO = require("./sizeDAO");
const transportDAO = require("./transportDAO");
const propositionDAO = require("./propositionDAO");
const Package = require("../../models/Package");
const Announce = require("../../models/Announce");
const userDAO = require("./userDAO");
const fileDAO = require("./fileDAO");

const SQL_DELETE = `DELETE FROM announce WHERE  id = ?`

const SQL_INSERT = `INSERT INTO announce SET id_package = ?, id_type = ?, price = ?, img_url = ?`;

const SQL_UPDATE = `UPDATE announce SET id_type = ?, price = ?, img_url = ? WHERE id =?`;

const SELECT_BY_ID = `SELECT a.id, a.id_package, a.views, a.id_type, a.price,
        a.img_url, a.date_created, p.id_announce, p.id_user, p.proposition, p.status_proposition
        FROM announce a
        INNER JOIN proposition p ON a.id = p.id_announce
        WHERE a.id = ?`;

const SELECT_ALL_USER = `SELECT a.id, a.id_package, a.views, a.id_type, a.price,
        a.img_url, a.date_created, p.id_announce, p.id_user, p.proposition, p.status_proposition
        FROM announce a
        INNER JOIN proposition p ON a.id = p.id_announce
        INNER JOIN rel_user_announce rua on a.id = rua.id_announce
        INNER JOIN users u on rua.id_user = u.id
        WHERE u.id = ?`;

const SELECT_BY_TYPE = `SELECT a.id, a.id_package, a.views, a.id_type, a.price,
        a.img_url, a.date_created, p.id_announce, p.id_user, p.proposition, p.status_proposition
        FROM announce a
        INNER JOIN proposition p ON a.id = p.id_announce
        WHERE a.id_type = ?`;

const SELECT_BY_TYPE_USER = `SELECT a.id, a.id_package, a.views, a.id_type, a.price,
        a.img_url, a.date_created, p.id_announce, p.id_user, p.proposition, p.status_proposition
        FROM announce a
        INNER JOIN proposition p ON a.id = p.id_announce
        INNER JOIN rel_user_announce rua on a.id = rua.id_announce
        INNER JOIN users u on rua.id_user = u.id
        WHERE a.id_type = ? AND u.id = ?`;

const errorMessage = "Data access error";

async function insert(announce, filesName){
    let con = null;
    let files = '';
    if(filesName){ files = filesName;}
    try{
        con = await database.getConnection();
        /* Addresse de départ */
        const AddressDeparture = await addressDAO.insert(announce.packages.addressDeparture);
        const idDepart = AddressDeparture.id;
        /* Addresse  d'arrivée */
        const AddressArrival = await addressDAO.insert(announce.packages.addressArrival);
        const idArrival = AddressArrival.id;
        /* Insertion du package */
        const Package = await packageDAO.insert(announce.packages);
        const idPack = Package.id;
        /* Insertion relation address */
        await addressDAO.insertRelation(idPack, idDepart);
        await addressDAO.insertRelation(idPack, idArrival);
        /* Insertion relation size */
        const sizes = announce.packages.sizes;
        sizes.forEach(el => sizeDAO.insertRelation(idPack, el.size.id));
        /* Insertion announce */
        const [idCreated] = await con.execute(SQL_INSERT, [idPack, announce.idType, announce.price, files]);
        const id = idCreated.insertId;
        /* Insertion relation user annonce */
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

async function update(announce, imgUrl){
    let con = null;
    let files = '';
    if(imgUrl){ files = imgUrl;}
    try{
        con = await database.getConnection();
        const oldAnnounce = await getById(announce.id);
        const oldSize = oldAnnounce.packages.sizes;
        /*Addresse de départ*/
        await addressDAO.update(announce.packages.addressDeparture);
        /*Addresse  d'arrivée*/
        await addressDAO.update(announce.packages.addressArrival);
        /* package */
        await packageDAO.update(announce.packages);
        /* Update relation size */
        const sizes = announce.packages.sizes;
        oldSize.forEach(el => sizeDAO.removeRelation(announce.packages.id, el.size.id));
        sizes.forEach(el => sizeDAO.insertRelation(announce.packages.id, el.size.id));
        /* annonce */
        await con.execute(SQL_UPDATE, [announce.idType, announce.price, files, announce.id]);
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
        const packages = await packageDAO.getById(packageId);
        const [address1] = await addressDAO.getByPackage(packageId, "depart");
        const [address2] = await addressDAO.getByPackage(packageId, "arrival");
        const [sizes] = await sizeDAO.getByPackage(packageId);
        const [user] = await userDAO.getUserForAnnounceByAnnounce(id);
        const [ transport ] = await transportDAO.getById(packages[0].id_transport);
        const newPackage = new Package(packageId, address1, address2, packages[0].datetime_departure, packages[0].datetime_arrival, packages[0].kg_available, packages[0].description_condition, transport, sizes);
        const newAnnounce = Announce.AnnounceId(announce[0].id, newPackage, announce[0].views, announce[0].id_type, announce[0].price, announce[0].img_url, announce[0].date_created, user);
        return newAnnounce;
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
        size.forEach(el => sizeDAO.removeRelation(announce.packages.id, el.size.id));
        // delete relation user
        await userDAO.removeRelationAnnounce(announce.id, announce.userAnnounce.id);
        // delete address
        await addressDAO.remove(announce.packages.addressDeparture.id);
        await addressDAO.remove(announce.packages.addressArrival.id);
        // delete proposition
        await propositionDAO.remove(annonce.id)
        //delete announce
        await con.execute(SQL_DELETE, [id]);
        // delete package
        await packageDAO.remove(announce.packages.id);
        //delete file
        let imgAnnounceBack = announce.imgUrl.split(',');
        imgAnnounceBack.forEach(el => fileDAO.remove(el));
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
            let announceId = announces[i].id;
            const [packages] = await packageDAO.getById(packageId);
            const [address1] = await addressDAO.getByPackage(packageId, "depart");
            const [address2] = await addressDAO.getByPackage(packageId, "arrival");
            const [sizes] = await sizeDAO.getByPackage(packageId);
            const [user] = await userDAO.getUserForAnnounceByAnnounce(announceId);
            const [ transport ] = await transportDAO.getById(packages.id_transport);
            const newPackage = new Package(packages.id, address1, address2, packages.datetime_departure, packages.datetime_arrival, packages.kg_available, packages.description_condition, transport, sizes);
            const announce = Announce.AnnounceId(announces[i].id, newPackage, announces[i].views, announces[i].id_type, announces[i].price, announces[i].img_url, announces[i].date_created, user);
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
    const SELECT_SEARCH = `SELECT DISTINCT a.id, a.id_package, a.views, a.id_type, a.price,
                                           a.img_url, a.date_created, p.id_announce, p.id_user, p.proposition, p.status_proposition
                            FROM announce a 
                            INNER JOIN package pk ON a.id = pk.id
                            INNER JOIN proposition p ON a.id = p.id_announce
                            INNER JOIN rel_package_address rpa_depart ON pk.id = rpa_depart.id_package
                            INNER JOIN rel_package_address rpa_arrival ON pk.id = rpa_arrival.id_package
                            INNER JOIN address ad_depart ON rpa_depart.id_address = ad_depart.id and ad_depart.id_info = 1 
                            INNER JOIN address ad_destination ON rpa_arrival.id_address = ad_destination.id and ad_destination.id_info = 2 
                            INNER JOIN rel_package_sizes rps ON pk.id = rps.id_package
                            INNER JOIN size s ON rps.id_size = s.id 
                            ${condition} `;

    try {
        con = await database.getConnection();
        const [announces] = await con.execute(SELECT_SEARCH);

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
            const announce = Announce.AnnounceId(announces[i].id, newPackage, announces[i].views, announces[i].id_type, announces[i].price, announces[i].img_url, announces[i].date_created, user);
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

async function getAllUser(id){
    let con = null;
    try{
        con = await database.getConnection();
        const [announces] = await con.execute(SELECT_ALL_USER, [id]);

        let newListAnnounce = [];
        for(let i = 0; i < announces.length; i++){
            let announceId = announces[i].id;
            let packageId = announces[i].id_package;
            const [packages] = await packageDAO.getById(packageId);
            const [address1] = await addressDAO.getByPackage(packageId, "depart");
            const [address2] = await addressDAO.getByPackage(packageId, "arrival");
            const [sizes] = await sizeDAO.getByPackage(packageId);
            const [user] = await userDAO.getUserForAnnounceByAnnounce(announceId);
            const [ transport ] = await transportDAO.getById(packages.id_transport);
            const newPackage = new Package(packages.id, address1, address2, packages.datetime_departure, packages.datetime_arrival, packages.kg_available, packages.description_condition, transport, sizes);
            const announce = Announce.AnnounceId(announces[i].id, newPackage, announces[i].views, announces[i].id_type, announces[i].price, announces[i].img_url, announces[i].date_created, user);
            newListAnnounce.push({"Announce": announce});
        }
        return newListAnnounce;
    }catch (error) {
        log.error("Error announceDAO getAllUser : " + error);
        throw errorMessage;
    } finally {
        if (con !== null) {
            con.end();
        }
    }
}

async function getByTypeUser(idType, id){
    let con = null;
    try{
        con = await database.getConnection();
        const [announces] = await con.execute(SELECT_BY_TYPE_USER, [idType, id]);
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
            const announce = Announce.AnnounceId(announces[i].id, newPackage, announces[i].views, announces[i].id_type, announces[i].price, announces[i].img_url, announces[i].date_created, user);
            newListAnnounce.push({"Announce": announce});
        }
        return newListAnnounce;
    }catch (error) {
        log.error("Error announceDAO getByTypeUser : " + error);
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
    getSearch,
    getAllUser,
    getByTypeUser,
}

/*
VERSION ENVOYER AU BACK

{"Announce" : {
            "packages":
                {
                    "addressDeparture" :
                        {
                            "idInfo": 1,
                            "number" : 9,
                            "street": "rue de la biere",
                            "additionalAddress" : "",
                            "zipCode": 25000,
                            "city" : "Brest",
                            "country": "France"
                        },
                    "addressArrival" :
                        {
                            "idInfo": 2,
                            "number" : 1,
                            "street": "rue du boulodrome",
                            "additionalAddress" : "1er étage",
                            "zipCode": 13000,
                            "city" : "Marseille",
                            "country": "France"
                        },
                    "datetimeDeparture" : "2022-10-19 03:14:07.999999",
                    "datetimeArrival" : "2022-11-19 03:14:07.999999",
                    "kgAvailable" : 8,
                    "description" : "",
                    "idTransport": 4,
                    "sizes": [
                {
                "size":{
                    "id": 1,
                    "name": "petit"
                    }
                },{
                "size": {
                    "id": 3,
                    "name": "grand"
                    }
             }
                    ]
                },

            "idType" : 2,
            "price" : 5,
            "transact" : true,
            "imgUrl" : "",
            "dateCreated" : "",
            "userAnnounce":
            {
                "id" : 33,
                "firstname" : "vinc",
                "lastname" : "dev"
            }
        }
}

VERSION RECUPERER

{
    "Message": "L'annonce a bien été créé.",
    "Announce": {
        "id": 14,
        "packages": {
            "id": 13,
            "addressDeparture": {
                "id": 22,
                "name": "depart",
                "number": 9,
                "street": "rue de la biere",
                "additionalAddress": "",
                "zipCode": "25000",
                "city": "Brest",
                "country": "France"
            },
            "addressArrival": {
                "id": 23,
                "name": "arrival",
                "number": 1,
                "street": "rue du boulodrome",
                "additionalAddress": "1er étage",
                "zipCode": "13000",
                "city": "Marseille",
                "country": "France"
            },
            "datetimeDeparture": "2022-10-19T01:14:08.000Z",
            "datetimeArrival": "2022-11-19T02:14:08.000Z",
            "kgAvailable": 8,
            "description": "",
            "transport": {
                "id": 4,
                "name": "train",
                "filename": "train.png"
            },
            "sizes": [
                {
                    "size": {
                        "id": 1,
                        "name": "petit",
                        "filename": "petit.png"
                    }
                },
                {
                    "size": {
                        "id": 3,
                        "name": "grand",
                        "filename": "grand.png"
                    }
                }
            ]
        },
        "views": 0,
        "finalPrice": null,
        "order": null,
        "idType": 2,
        "price": 5,
        "transact": 1,
        "imgUrl": "20191220_195101.jpg,Vincent-Colas-mer.jpg,Vincent-Colas-ski.JPG",
        "dateCreated": "2021-10-06T08:27:26.000Z",
        "userAnnounce": {
            "id": 33,
            "firstname": "vinc",
            "lastname": "dev",
            "average_opinion": 0
        }
    }
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
        "sizes": [
            {
                "size": {
                    "id": 2,
                    "name": "moyen"
                }
            },{
                "size": {
                    "id": 3,
                        "name": "grand"
                }
            }
        ],
        "kgAvailable": 6.5,
        "transport": 5,
        "type": 2
    }
}
*
*UPDATE
*
* {
    "Announce": {
        "id": 11,
        "packages": {
            "id": 10,
            "addressDeparture": {
                "id": 16,
                "name": "depart",
                "number": 9,
                "street": "rue de la biere",
                "additionalAddress": "",
                "zipCode": "25000",
                "city": "Brest",
                "country": "France"
            },
            "addressArrival": {
                "id": 17,
                "name": "arrival",
                "number": 1,
                "street": "rue du boulodrome",
                "additionalAddress": "1er étage",
                "zipCode": "13000",
                "city": "Marseille",
                "country": "France"
            },
            "datetimeDeparture": "2022-10-19T01:14:08.000Z",
            "datetimeArrival": "2022-11-19T02:14:08.000Z",
            "kgAvailable": 13,
            "description": "",
            "transport": {
                "id": 2,
                "name": "avion",
                "filename": "avion.png"
            },
            "sizes": [
                {
                    "size": {
                        "id": 2,
                        "name": "moyen",
                        "filename": "moyen.png"
                    }
                },
                {
                    "size": {
                        "id": 3,
                        "name": "grand",
                        "filename": "grand.png"
                    }
                }
            ]
        },
        "views": 0,
        "finalPrice": null,
        "order": null,
        "idType": 2,
        "price": 25,
        "transact": 1,
        "imgUrl": "",
        "dateCreated": "2021-10-05T07:37:43.000Z",
        "userAnnounce": {
            "id": 33,
            "firstname": "vinc",
            "lastname": "dev",
            "average_opinion": 0
        }
    }
}
*
*
* */


